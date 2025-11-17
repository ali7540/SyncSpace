import prisma from '../../config/prisma.js';

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