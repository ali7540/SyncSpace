import prisma from '../../config/prisma.js';

// Helper to check auth and return role
const getAuthorizedDocument = async (documentId, userId) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { 
      sharedWith: true,
      owner: { select: { id: true, name: true, email: true } } // Include Owner Info
    },
  });

  if (!document) return null;

  let role = null;

  if (document.ownerId === userId) {
    role = 'OWNER';
  } else {
    const shareEntry = document.sharedWith.find(share => share.userId === userId);
    if (shareEntry) {
      role = shareEntry.role; // 'EDITOR' or 'VIEWER'
    }
  }

  if (!role) return null; // Not authorized

  return { document, role };
};

export const getDocuments = async (req, res) => {
  const userId = req.user.id;

  try {
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { sharedWith: { some: { userId: userId } } }
        ]
      },
      include: {
        owner: { select: { name: true, email: true } }, // Return owner name for dashboard
        sharedWith: true 
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

export const createDocument = async (req, res) => {
  const userId = req.user.id;
  const { title } = req.body;

  try {
    const newDocument = await prisma.document.create({
      data: {
        title: title || "Untitled",
        content: {},
        ownerId: userId
      }
    });
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await getAuthorizedDocument(id, userId);

    if (!result) {
      return res.status(404).json({ errors: [{ msg: 'Document not found or access denied' }] });
    }

    // Return the document AND the user's specific role
    res.status(200).json({ ...result.document, userRole: result.role });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, content } = req.body;

    // ... (Existing auth checks) ...
    const result = await getAuthorizedDocument(id, userId);
    if (!result) return res.status(404).json({ errors: [{ msg: 'Access denied' }] });
    const { role, document } = result; // Need the document object too
    
    if (role === 'VIEWER') return res.status(403).json({ errors: [{ msg: 'Viewers cannot modify' }] });

    // --- AUTO-VERSION LOGIC ---
    // Check the last version timestamp
    const lastVersion = await prisma.version.findFirst({
        where: { documentId: id },
        orderBy: { createdAt: 'desc' }
    });

    const now = new Date();
    // If no version exists OR last version is older than 30 minutes
    const shouldSnapshot = !lastVersion || (now - new Date(lastVersion.createdAt) > 30 * 60 * 1000);
    
    if (shouldSnapshot && content) {
        // Create a snapshot of the OLD content before overwriting it
        await prisma.version.create({
            data: {
                documentId: id,
                content: document.content, // Save the state BEFORE this update
                authorId: userId // The person triggering the update
            }
        });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: id },
      data: { title, content },
    });

    res.status(200).json(updatedDocument);
  } catch (error) {
    // ... error handling
    console.error('Update error:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) return res.status(404).json({ errors: [{ msg: 'Not found' }] });

    if (document.ownerId !== userId) {
      return res.status(403).json({ errors: [{ msg: 'Only owner can delete' }] });
    }

    await prisma.document.delete({ where: { id } });
    res.status(200).json({ msg: 'Deleted' });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

export const shareDocument = async (req, res) => {
  // (This function remains the same as previously implemented)
  try {
    const { id } = req.params;
    const { email, role } = req.body;
    const ownerId = req.user.id;

    if (!email) return res.status(400).json({ errors: [{ msg: 'Email required' }] });

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document || document.ownerId !== ownerId) {
      return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });
    }

    const userToShare = await prisma.user.findUnique({ where: { email } });
    if (!userToShare) return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    if (userToShare.id === ownerId) return res.status(400).json({ errors: [{ msg: 'Cannot share with self' }] });

    const shareEntry = await prisma.documentShare.upsert({
      where: { documentId_userId: { documentId: id, userId: userToShare.id } },
      update: { role: role || 'EDITOR' },
      create: { documentId: id, userId: userToShare.id, role: role || 'EDITOR' }
    });

    res.status(200).json({ msg: 'Shared successfully', shareEntry });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};