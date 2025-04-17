import clientPromise from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    switch (req.method) {
      case 'GET':
        const users = await db.collection('users').find({}).toArray();
        res.status(200).json(users);
        break;

      case 'POST':
        const { firebaseUid, username, dateOfBirth, profilePicture } = req.body;
        
        // Validate required fields
        if (!firebaseUid || !username || !dateOfBirth) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ firebaseUid });
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = {
          firebaseUid,
          username,
          dateOfBirth: new Date(dateOfBirth),
          profilePicture: profilePicture || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);
        res.status(201).json(result);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}