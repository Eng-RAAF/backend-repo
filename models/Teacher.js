import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

teacherSchema.index({ email: 1 });
teacherSchema.index({ createdAt: -1 });

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

export default Teacher;

