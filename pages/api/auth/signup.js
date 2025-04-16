import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, username, firebaseUid, dateOfBirth } = req.body;

    // Validate required fields
    if (!email || !username || !firebaseUid || !dateOfBirth) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new user in MongoDB
    const user = await User.create({
      email,
      username,
      firebaseUid,
      dateOfBirth: new Date(dateOfBirth),
      onboardingCompleted: false
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ error: 'User already exists' });
    }

    res.status(500).json({ error: 'Failed to create user' });
  }
}