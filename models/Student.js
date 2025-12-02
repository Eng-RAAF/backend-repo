import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
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
  age: {
    type: Number,
    min: 0
  },
  grade: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create indexes
studentSchema.index({ email: 1 });
studentSchema.index({ createdAt: -1 });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;

