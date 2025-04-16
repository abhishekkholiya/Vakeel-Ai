import formidable from 'formidable';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = getStorage();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await form.parse(req);
    const { username, dateOfBirth, email } = fields;

    let profilePictureUrl = '';

    // Handle profile picture upload if provided
    if (files.profilePicture) {
      const file = files.profilePicture[0];
      const storageRef = ref(storage, `profile-pictures/${Date.now()}-${file.originalFilename}`);
      
      const fileBuffer = await fs.promises.readFile(file.filepath);
      await uploadBytes(storageRef, fileBuffer);
      
      profilePictureUrl = await getDownloadURL(storageRef);
    }

    // Create or update user profile
    const user = await User.findOneAndUpdate(
      { email: email[0] },
      {
        username: username[0],
        dateOfBirth: new Date(dateOfBirth[0]),
        profilePicture: profilePictureUrl,
        onboardingCompleted: true
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Onboarding completed successfully', user });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Failed to complete onboarding' });
  }
}