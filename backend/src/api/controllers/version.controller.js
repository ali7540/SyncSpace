import prisma from '../../config/prisma.js';

/**
 * @route   GET /api/docs/:id/versions
 * @desc    Get all version history for a document
 * @access  Private (Viewers allowed to SEE history, but not restore)
 */
export const getVersions = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: { sharedWith: true }
    });

    if (!document) return res.status(404).json({ errors: [{ msg: 'Document not found' }] });

    const isOwner = document.ownerId === userId;
    const isShared = document.sharedWith.some(share => share.userId === userId);

    if (!isOwner && !isShared) {
      return res.status(403).json({ errors: [{ msg: 'Access denied' }] });
    }

    const versions = await prisma.version.findMany({
      where: { documentId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, email: true } }
      }
    });

    res.status(200).json(versions);
    // console.log(versions)
  } catch (error) {
    console.error('Error fetching versions:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};



export const createVersion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  try {
    const document = await prisma.document.findUnique({
        where: { id },
        include: { sharedWith: true }
    });

    if (!document) return res.status(404).json({ errors: [{ msg: 'Document not found' }] });
    
    // Permission check
    const isOwner = document.ownerId === userId;
    const shareEntry = document.sharedWith.find(share => share.userId === userId);
    const isEditor = shareEntry && shareEntry.role === 'EDITOR';

    if (!isOwner && !isEditor) {
        return res.status(403).json({ errors: [{ msg: 'Only editors can save versions' }] });
    }

    // FIX: Ensure content is never null. Fallback to empty object {}
    const versionContent = content || document.content || {};

    const newVersion = await prisma.version.create({
      data: {
        documentId: id,
        content: versionContent,
        authorId: userId
      }
    });

    res.status(201).json(newVersion);
  } catch (error) {
    console.error('Error creating version:', error);
    res.status(500).json({ errors: [{ msg: 'Server error creating version' }] });
  }
};