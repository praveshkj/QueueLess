import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema(
  {
    counterName: {
      type: String,
      required: [true, 'Counter name is required'],
      trim: true,
      maxlength: [50, 'Counter name cannot exceed 50 characters'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Assigned service ID is required'],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Counter = mongoose.model('Counter', counterSchema);
