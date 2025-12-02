import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null
  },
  schedule: {
    type: String,
    trim: true
  },
  capacity: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

classSchema.index({ code: 1 });
classSchema.index({ teacherId: 1 });
classSchema.index({ createdAt: -1 });

const Class = mongoose.models.Class || mongoose.model('Class', classSchema);

export default Class;

