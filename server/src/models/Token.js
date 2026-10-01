import mongoose from 'mongoose';
import { TOKEN_STATUS, TOKEN_STATUS_LIST } from '../constants/tokenStatus.js';
import { PRIORITY_LEVELS, PRIORITY_LEVEL_LIST } from '../constants/priorityLevels.js';

const tokenSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: String,
      required: [true, 'Token number is required'],
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required'],
      index: true,
    },
    counterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Counter',
      default: null,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    priorityLevel: {
      type: String,
      enum: {
        values: PRIORITY_LEVEL_LIST,
        message: '{VALUE} is not a valid priority level',
      },
      default: PRIORITY_LEVELS.P2, // Default to Walk-in
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: TOKEN_STATUS_LIST,
        message: '{VALUE} is not a valid token status',
      },
      default: TOKEN_STATUS.WAITING,
      index: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
      index: true,
    },
    calledAt: {
      type: Date,
      default: null,
    },
    serviceStartedAt: {
      type: Date,
      default: null,
    },
    servedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimal queue sorting: status, service, priorityLevel, checkInTime
tokenSchema.index({ serviceId: 1, status: 1, priorityLevel: 1, checkInTime: 1 });

export const Token = mongoose.model('Token', tokenSchema);
