import mongoose from "mongoose";

export interface MedicationLog extends mongoose.Document {
  patient_id: mongoose.Schema.Types.ObjectId;
  medication_name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  prescribed_by?: string;
  start_date: Date;
  end_date?: Date;
  is_active: boolean;
  adherence_logs: {
    date: Date;
    was_taken: boolean;
    notes?: string;
  }[];
}

const medicationLogSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medication_name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    instructions: String,
    prescribed_by: String,
    start_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    end_date: Date,
    is_active: {
      type: Boolean,
      default: true,
    },
    adherence_logs: [
      {
        date: {
          type: Date,
          required: true,
        },
        was_taken: {
          type: Boolean,
          required: true,
        },
        notes: String,
      },
    ],
  },
  {
    collection: "medicationLogs",
    timestamps: true,
  }
);

export default mongoose.models.MedicationLog ||
  mongoose.model<MedicationLog>("MedicationLog", medicationLogSchema);