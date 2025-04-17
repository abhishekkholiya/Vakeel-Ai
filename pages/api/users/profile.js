import { IncomingForm } from 'formidable';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import User from '../../../models/User';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const form = new IncomingForm();
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { fields, files } = data;
    let profilePictureUrl = '';

    // Upload image to Cloudinary if provided
    if (files.profilePicture) {
      const result = await cloudinary.uploader.upload(files.profilePicture.filepath, {
        folder: 'vakeel-ai/profiles',
      });
      profilePictureUrl = result.secure_url;
    }

    // Create new user document
    const user = new User({
      firebaseUid: fields.firebaseUid,
      username: fields.username,
      dateOfBirth: new Date(fields.dateOfBirth),
      profilePicture: profilePictureUrl,
    });

    await user.save();

    res.status(201).json({ message: 'Profile created successfully', user });
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
}