import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  profilePicture: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;