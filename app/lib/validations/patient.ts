import { z } from "zod";
import { ChangeEvent } from "react";

// Core Schemas
export const hospitalSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  profile: z.string(),
  hospital_id: z.string().optional(),
  hospital_name: z.string().optional(),
  appointment_charge: z.string().optional(),
});

export const doctorSchema = z.object({
  name: z.string(),
  profile: z.string(),
  specialty: z.string().optional(),
});

export const timingSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
});

// Medical History Schema
export const medicalHistorySchema = z.object({
  _id: z.string().optional(),
  hospital: hospitalSchema,
  doctor: doctorSchema,
  disease: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  TreatmentStatus: z.enum(["Completed", "Ongoing", "Cancelled"]),
});

// Payment & Transaction Schemas
export const paymentHistorySchema = z.object({
  _id: z.string().optional(),
  txnDocumentId: z.string().optional(),
  hospital: hospitalSchema,
  date: z.string().optional(),
  amount: z.number(),
  disease: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["Success", "Failed", "Pending"]),
  createdAt: z.string().optional(),
});

export const transactionSchema = z.object({
  transaction_id: z.string().nullable(),
  patient_id: z.string(),
  hospital_id: z.string(),
  disease: z.string(),
  description: z.string(),
  amount: z.string(),
  status: z.string(),
});

export const pendingBillSchema = z.object({
  txnDocumentId: z.string(),
  hospital: hospitalSchema,
  date: z.string(),
  amount: z.number(),
});

// Appointment Schemas
export const bookedAppointmentSchema = z.object({
  _id: z.string(),
  timing: timingSchema,
  state: z.string(),
  city: z.string(),
  hospital: hospitalSchema,
  disease: z.string(),
  note: z.string(),
  approved: z.string(),
  patient_id: z.string(),
  doctor_id: z.string(),
  receptionist_id: z.string(),
  doctor: doctorSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const bookingAppointmentSchema = z.object({
  state: z.string(),
  city: z.string(),
  hospital: hospitalSchema,
  disease: z.string(),
  note: z.string(),
});

export const bookAppointmentSchema = z.object({
  patient_id: z.string(),
  date: z.string(),
  timing: timingSchema,
  state: z.string(),
  city: z.string(),
  hospital: z.object({
    id: z.string(),
    name: z.string()
  }),
  disease: z.string().min(1),
  note: z.string().optional(),
  family_member_id: z.string().optional(),
});

// Family Member Schema
export const familyMemberSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  contact: z.string().min(10),
  country_code: z.string().min(1),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string(),
  relation: z.string().min(1),
});

// Chat & Lab Schemas
export const doctorChatSchema = z.object({
  id: z.number(),
  name: z.string(),
  specialty: z.string(),
  avatar: z.string(),
  status: z.enum(["online", "offline"]),
  lastMessage: z.string(),
  lastMessageTime: z.string(),
});

export const labResultSchema = z.object({
  id: z.string(),
  test: z.string(),
  date: z.string(),
  status: z.enum(["Completed", "Pending", "Processing"]),
  result: z.string(),
});

// Array Schemas
export const bookedAppointmentsSchema = z.array(bookedAppointmentSchema);
export const medicalHistoryResponseSchema = z.array(medicalHistorySchema);
export const paymentHistoryResponseSchema = z.array(paymentHistorySchema);

// Enum Schemas
export const patientTabsKeySchema = z.enum(["bills", "doctors", "lab"]);

// Inferred Types
export type Hospital = z.infer<typeof hospitalSchema>;
export type Doctor = z.infer<typeof doctorSchema>;
export type Timing = z.infer<typeof timingSchema>;
export type MedicalHistory = z.infer<typeof medicalHistorySchema>;
export type PaymentHistory = z.infer<typeof paymentHistorySchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type PendingBill = z.infer<typeof pendingBillSchema>;
export type BookedAppointment = z.infer<typeof bookedAppointmentSchema>;
export type BookedAppointments = z.infer<typeof bookedAppointmentsSchema>;
export type BookingAppointment = z.infer<typeof bookingAppointmentSchema>;
export type BookAppointment = z.infer<typeof bookAppointmentSchema>;
export type FamilyMember = z.infer<typeof familyMemberSchema>;
export type DoctorChat = z.infer<typeof doctorChatSchema>;
export type LabResult = z.infer<typeof labResultSchema>;
export type PatientTabsKey = z.infer<typeof patientTabsKeySchema>;

// Component Props Types
export type BookAppointmentProps = {
  patientId: string;
  name: string;
  email: string;
};
export type BookAppointmentHospital = Hospital;
export type AdditionalNoteProps = {
  additionalNote: string;
  noteError: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
export type StateSelectorProps = {
  selectedState: string;
  onStateChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};
export type CitySelectorProps = {
  selectedState: string;
  selectedCity: string;
  onCityChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isOpenPopover: boolean;
  setIsOpenPopover: (open: boolean) => void;
};
export type HospitalSelectorProps = {
  selectedState: string;
  selectedCity: string;
  selectedHospital: BookAppointmentHospital;
  onHospitalChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isOpenHospitalPopover: boolean;
  setIsOpenHospitalPopover: (open: boolean) => void;
};
export type DiseaseSelectorProps = {
  selectedHospital: BookAppointmentHospital;
  selectedDisease: string;
  onDiseaseChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isOpenDiseasePopover: boolean;
  setIsOpenDiseasePopover: (open: boolean) => void;
};

// Composite Types
export type BookingAppointmentType = BookingAppointment & {
  transaction_id: string | null;
};
export type Payment = PaymentHistory;
export type PaymentDetailsProps = {
  paymentHistory: Payment[];
};
export type MedicalDetailsProps = {
  medicalDetails: MedicalHistory[];
};