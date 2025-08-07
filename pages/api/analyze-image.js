import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { analyzeImageWithAI } from '../../lib/openai';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { imageBase64, fileName, fileUrl } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: 'Image data required' });
    }

    const userDoc = await getDoc(doc(db, 'users', session.user.id));
    const userProfile = userDoc.data()?.profile || {};

    const analysis = await analyzeImageWithAI(imageBase64, userProfile);

    const analysisData = {
      userId: session.user.id,
      fileName,
      fileUrl,
      analysis,
      timestamp: new Date(),
    };

    const docRef = await addDoc(collection(db, 'analyses'), analysisData);

    res.status(200).json({
      success: true,
      analysisId: docRef.id,
      analysis,
    });

  } catch (error) {
    console.error('Analysis API Error:', error);
    res.status(500).json({ 
      message: 'Analysis failed',
      error: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
