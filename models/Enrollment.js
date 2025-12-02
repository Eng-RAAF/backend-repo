import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Unique constraint on studentId + classId combination
enrollmentSchema.index({ studentId: 1, classId: 1 }, { unique: true });
enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ classId: 1 });
enrollmentSchema.index({ enrolledAt: -1 });

const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;

