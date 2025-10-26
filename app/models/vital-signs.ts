import mongoose from "mongoose";

export interface VitalSigns extends mongoose.Document {
  patient_id: mongoose.Schema.Types.ObjectId;
  weight?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  temperature?: number;
  oxygen_saturation?: number;
  blood_sugar?: number;
  notes?: string;
  recorded_at: Date;
}

const vitalSignsSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    weight: {
      type: Number,
      min: 0,
      max: 1000, // kg
    },
    systolic_bp: {
      type: Number,
      min: 50,
      max: 300, // mmHg
    },
    diastolic_bp: {
      type: Number,
      min: 30,
      max: 200, // mmHg
    },
    heart_rate: {
      type: Number,
      min: 30,
      max: 250, // bpm
    },
    temperature: {
      type: Number,
      min: 30,
      max: 45, // Celsius
    },
    oxygen_saturation: {
      type: Number,
      min: 0,
      max: 100, // %
    },
    blood_sugar: {
      type: Number,
      min: 0,
      max: 1000, // mg/dL
    },
    notes: String,
    recorded_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "vitalSigns",
    timestamps: true,
  }
);

export default mongoose.models.VitalSigns ||
  mongoose.model<VitalSigns>("VitalSigns", vitalSignsSchema);