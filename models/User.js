import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
    trim: true
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student', 'teacher', 'admin']
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

