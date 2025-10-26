import mongoose from "mongoose";

export interface Patient extends mongoose.Document {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  role: string;
  otp: string;
  dob: string;
  gender: string;
  contact: string;
  countryCode: string;
  profile: string;
  address: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
  };
  current_hospital: mongoose.Schema.Types.ObjectId;
  physicalDetails: {
    age: number;
    blood: string;
    height: number;
    weight: number;
  };
  healthConditions: number[];
}

const patientSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "patient" },
    otp: String,
    dob: { type: String, required: false },
    gender: {
      type: String,
      required: false,
      enum: ["Male", "Female", "Other"],
    },
    contact: { type: String, required: false },
    countryCode: { type: String, default: "+1" },
    profile: String,
    address: {
      _id: false,
      address_line_1: String,
      address_line_2: String,
      city: String,
      state: String,
      country: String,
      zip_code: String,
    },
    current_hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    physicalDetails: {
      _id: false,
      age: Number,
      blood: String,
      height: Number,
      weight: Number,
    },
    healthConditions: [Number],
  },
  { collection: "patient", timestamps: true }
);

export default mongoose.models.Patient ||
  mongoose.model<Patient>("Patient", patientSchema);
