import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Service name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    avgServiceTime: {
      type: Number,
      required: [true, 'Average service time (in minutes) is required'],
      min: [1, 'Average service time must be at least 1 minute'],
      default: 15,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model('Service', serviceSchema);
