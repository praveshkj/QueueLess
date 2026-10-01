import mongoose from 'mongoose';
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LIST } from '../constants/appointmentStatus.js';

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required'],
    },
    slotTime: {
      type: Date,
      required: [true, 'Appointment slot time is required'],
    },
    status: {
      type: String,
      enum: {
        values: APPOINTMENT_STATUS_LIST,
        message: '{VALUE} is not a valid appointment status',
      },
      default: APPOINTMENT_STATUS.SCHEDULED,
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);
