import prisma from '../../config/prisma.js';

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

// export const getDocuments = async (req, res) => {
//   const userId = req.user.id;
  
//   const { search, filter, sort, page = 1, limit = 12 } = req.query;

//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const skip = (pageNum - 1) * limitNum;

//   try {
//     const whereClause = {
//       ...(search && {
//         title: { contains: search, mode: 'insensitive' },
//       }),
//     };

//     if (filter === 'owned') {
//       whereClause.ownerId = userId;
//     } else if (filter === 'shared') {
//       whereClause.sharedWith = { some: { userId: userId } };
//     } else {
//       whereClause.OR = [
//         { ownerId: userId },
//         { sharedWith: { some: { userId: userId } } }
//       ];
//     }

//     let orderBy = {};
//     switch (sort) {
//       case 'title_asc': orderBy = { title: 'asc' }; break;
//       case 'title_desc': orderBy = { title: 'desc' }; break;
//       case 'modified_asc': orderBy = { updatedAt: 'asc' }; break;
//       case 'modified_desc': default: orderBy = { updatedAt: 'desc' }; break;
//     }

//     const [documents, totalDocuments] = await prisma.$transaction([
//       prisma.document.findMany({
//         where: whereClause,
//         orderBy: orderBy,
//         skip: skip,      
//         take: limitNum,  
//         include: {
//           owner: { select: { name: true, email: true } },
//           sharedWith: true 
//         }
//       }),
//       prisma.document.count({ where: whereClause }) 
//     ]);

//     res.status(200).json({
//       documents,
//       pagination: {
//         total: totalDocuments,
//         page: pageNum,
//         limit: limitNum,
//         totalPages: Math.ceil(totalDocuments / limitNum)
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching documents:', error);
//     res.status(500).json({ errors: [{ msg: 'Server error fetching documents' }] });
//   }
// };

export const getDocuments = async (req, res) => {
  const userId = req.user.id;
  const { search, filter, sort, page = 1, limit = 12 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  try {
    // ... (keep whereClause logic unchanged)
    const whereClause = {
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
    };

    if (filter === 'owned') {
      whereClause.ownerId = userId;
    } else if (filter === 'shared') {
      whereClause.sharedWith = { some: { userId: userId } };
    } else {
      whereClause.OR = [
        { ownerId: userId },
        { sharedWith: { some: { userId: userId } } }
      ];
    }

    // --- FIX: Case-Insensitive Sorting ---
    let orderBy = {};
    
    switch (sort) {
      case 'title_asc':
        // Sort by title, A-Z, case insensitive
        orderBy = { 
            title: 'asc' 
        };
        break;
      case 'title_desc':
        // Sort by title, Z-A, case insensitive
        orderBy = { 
            title: 'desc' 
        };
        break;
      case 'modified_asc':
        orderBy = { updatedAt: 'asc' };
        break;
      case 'modified_desc':
      default:
        orderBy = { updatedAt: 'desc' };
        break;
    }
    
    const [documents, totalDocuments] = await prisma.$transaction([
      prisma.document.findMany({
        where: whereClause,
        orderBy: orderBy,
        skip: skip,
        take: limitNum,
        include: {
          owner: { select: { name: true, email: true } },
          sharedWith: true 
        }
      }),
      prisma.document.count({ where: whereClause })
    ]);

    if (sort === 'title_asc') {
        documents.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    } else if (sort === 'title_desc') {
        documents.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: 'base' }));
    }

    res.status(200).json({
      documents,
      pagination: {
        total: totalDocuments,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalDocuments / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ errors: [{ msg: 'Server error fetching documents' }] });
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

    const result = await getAuthorizedDocument(id, userId);
    if (!result) return res.status(404).json({ errors: [{ msg: 'Access denied' }] });
    const { role, document } = result; 
    
    if (role === 'VIEWER') return res.status(403).json({ errors: [{ msg: 'Viewers cannot modify' }] });

    const lastVersion = await prisma.version.findFirst({
        where: { documentId: id },
        orderBy: { createdAt: 'desc' }
    });

    const now = new Date();
    const shouldSnapshot = !lastVersion || (now - new Date(lastVersion.createdAt) > 30 * 60 * 1000);
    
    if (shouldSnapshot && content) {
        await prisma.version.create({
            data: {
                documentId: id,
                content: document.content, 
                authorId: userId 
            }
        });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: id },
      data: { title, content },
    });

    res.status(200).json(updatedDocument);
  } catch (error) {
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