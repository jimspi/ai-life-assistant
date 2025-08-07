import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { db } from '../../lib/firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { analysisId, feedback, userId } = req.body;

    if (!analysisId || !feedback) {
      return res.status(400).json({ message: 'Analysis ID and feedback required' });
    }

    await updateDoc(doc(db, 'analyses', analysisId), {
      userFeedback: feedback,
      feedbackTimestamp: new Date(),
    });

    await addDoc(collection(db, 'feedback'), {
      analysisId,
      userId,
      feedback,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Feedback saved successfully'
    });

  } catch (error) {
    console.error('Feedback API Error:', error);
    res.status(500).json({ 
      message: 'Failed to save feedback',
      error: error.message 
    });
  }
}
