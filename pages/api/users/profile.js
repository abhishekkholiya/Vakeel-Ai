import mongoose from 'mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { username, dateOfBirth, firebaseUid } = req.body;

    // Validate required fields
    if (!username || !dateOfBirth || !firebaseUid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create new user document
    const user = new User({
      firebaseUid,
      username,
      dateOfBirth: new Date(dateOfBirth),
      profilePicture: ''}); // Empty string for profile picture

    await user.save();

    res.status(201).json({ message: 'Profile created successfully', user });
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
}