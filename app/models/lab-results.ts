import mongoose from "mongoose";

export interface LabResult extends mongoose.Document {
  patient_id: mongoose.Schema.Types.ObjectId;
  test_name: string;
  test_type: string;
  result_value: string;
  reference_range: string;
  status: "Normal" | "Abnormal" | "Critical" | "Pending";
  test_date: Date;
  report_date: Date;
  lab_name: string;
  doctor_notes?: string;
  report_url?: string;
}

const labResultSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    test_name: {
      type: String,
      required: true,
    },
    test_type: {
      type: String,
      required: true,
    },
    result_value: {
      type: String,
      required: true,
    },
    reference_range: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Normal", "Abnormal", "Critical", "Pending"],
      default: "Pending",
    },
    test_date: {
      type: Date,
      required: true,
    },
    report_date: {
      type: Date,
      default: Date.now,
    },
    lab_name: {
      type: String,
      required: true,
    },
    doctor_notes: String,
    report_url: String,
  },
  {
    collection: "labResults",
    timestamps: true,
  }
);

export default mongoose.models.LabResult ||
  mongoose.model<LabResult>("LabResult", labResultSchema);