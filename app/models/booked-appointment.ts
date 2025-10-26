import mongoose from "mongoose";

export interface BookedAppointment extends mongoose.Document {
  date: Date;
  timing: {
    startTime: string;
    endTime: string;
  };
  state: string;
  city: string;
  hospital: {
    id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  disease: string;
  note: string;
  approved: 'pending' | 'approved' | 'rejected';
  patient_id: mongoose.Schema.Types.ObjectId;
  assigned_doctor?: mongoose.Schema.Types.ObjectId;
  assigned_receptionist?: mongoose.Schema.Types.ObjectId;
  appointment_status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  // Family booking fields
  booked_for?: {
    type: 'self' | 'family';
    family_member_id?: mongoose.Schema.Types.ObjectId;
    patient_name?: string;
    patient_relation?: string;
  };
  // Payment details
  payment?: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    amount: string;
    status: 'pending' | 'completed' | 'failed';
  };
  // Bill receipt
  bill_receipt_url?: string;
}

const bookedAppointmentsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    timing: {
      startTime: { type: String, required: false },
      endTime: { type: String, required: false },
    },
    state: { type: String, required: true },
    city: { type: String, required: true },
    hospital: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
    disease: { type: String, required: true },
    note: { type: String, required: true },
    approved: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    assigned_doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    assigned_receptionist: { type: mongoose.Schema.Types.ObjectId, ref: 'Receptionist' },
    appointment_status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled'
    },
    // Family booking fields
    booked_for: {
      type: {
        type: String,
        enum: ['self', 'family'],
        default: 'self'
      },
      family_member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember' },
      patient_name: { type: String },
      patient_relation: { type: String }
    },
    // Payment details
    payment: {
      razorpayPaymentId: { type: String, required: true },
      razorpayOrderId: { type: String, required: true },
      amount: { type: String, required: true },
      status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
    },
    // Bill receipt
    bill_receipt_url: { type: String },
  },
  { collection: "bookedAppointments", timestamps: true }
);

export default mongoose.models.BookedAppointment ||
  mongoose.model<BookedAppointment>(
    "BookedAppointment",
    bookedAppointmentsSchema
  );
