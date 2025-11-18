import prisma from '../../config/prisma.js';

/**
 * Helper function to check if a user is authorized to access a document.
 * They are authorized if they are the owner OR they are in the sharedWith list.
 */
const getAuthorizedDocument = async (documentId, userId) => {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
    include: {
      sharedWith: true, 
    },
  });

  if (!document) {
    return null;
  }

  if (document.ownerId === userId) {
    return document;
  }

  const isSharedWith = document.sharedWith.some(share => share.userId === userId);
  if (isSharedWith) {
    return document;
  }

  return null;
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
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ errors: [{ msg: 'Server error while fetching documents' }] });
  }
};

export const createDocument = async (req, res) => {
  const userId = req.user.id;
  
  const { title } = req.body;

  try {
    const docTitle = title || "Untitled";

    const newDocument = await prisma.document.create({
      data: {
        title: docTitle,
        content: {},
        ownerId: userId
      }
    });

    res.status(201).json(newDocument); 
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ errors: [{ msg: 'Server error while creating document' }] });
  }
};


export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const document = await getAuthorizedDocument(id, userId);

    if (!document) {
      return res.status(404).json({ errors: [{ msg: 'Document not found or you do not have access' }] });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document by ID:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};


export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, content } = req.body; 

    const document = await getAuthorizedDocument(id, userId);

    if (!document) {
      return res.status(404).json({ errors: [{ msg: 'Document not found or you do not have access' }] });
    }

    const isOwner = document.ownerId === userId;
    const shareEntry = document.sharedWith.find(share => share.userId === userId);
    const isEditor = shareEntry && shareEntry.role === 'EDITOR';
    
    // We haven't implemented roles yet in Prisma, so this is a placeholder
    // For now, we'll just check for authorization (which our helper does)
    // A more robust check will be added when we build sharing.
    // Let's just use the helper for now.

  
    const updatedDocument = await prisma.document.update({
      where: { id: id },
      data: {
        title: title, 
        content: content, 
      },
    });

    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};


export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const document = await prisma.document.findUnique({
      where: { id: id },
    });

    if (!document) {
      return res.status(404).json({ errors: [{ msg: 'Document not found' }] });
    }

    if (document.ownerId !== userId) {
      return res.status(403).json({ errors: [{ msg: 'Access denied: Only the owner can delete this document' }] });
    }

    await prisma.document.delete({
      where: { id: id },
    });

    res.status(200).json({ msg: 'Document deleted successfully' });
  } catch (error)
 {
    console.error('Error deleting document:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};