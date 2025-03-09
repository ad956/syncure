type MedicalDetailsProps = {
  medicalDetails: MedicalHistory[];
};

type PaymentHistory = {
  _id: string;
  hospital: {
    name: string;
    profile: string;
  };
  disease: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
};
type MedicalHistory = {
  hospital: {
    name: string;
    profile: string;
  };
  doctor: {
    name: string;
    profile: string;
  };
  start_date: string;
  end_date: string;
  TreatmentStatus: "Completed" | "Ongoing";
  disease: string;
};

type TransactionType = {
  transaction_id: string | null;
  patient_id: string;
  hospital_id: string;
  disease: string;
  description: string;
  amount: string;
  status: string;
};

type BookingAppointmentType = bookingAppointment & {
  transaction_id: string | null;
};

type Payment = {
  hospital: {
    name: string;
    profile: string;
  };
  disease: string;
  description: string;
  date: string;
  amount: number;
  status: "Success" | "Failed";
};

type PaymentDetailsProps = {
  paymentHistory: Payment[];
};

type PendingBill = {
  txnDocumentId: string; // _id of each transaction document
  hospital: {
    name: string;
    profile: string;
  };
  date: string;
  amount: number;
};

type DoctorChat = {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage: string;
  lastMessageTime: string;
};

type LabResult = {
  id: string;
  test: string;
  date: string;
  status: "Completed" | "Pending" | "Processing";
  result: string;
};

type PatientTabsKey = "bills" | "doctors" | "lab";

// appointment related types
type bookedAppointments = [
  {
    _id: string;
    timing: {
      startTime: string;
      endTime: string;
    };
    state: string;
    city: string;
    hospital: {
      id: string;
      name: string;
    };
    disease: string;
    note: string;
    approved: string;
    patient_id: string;
    doctor_id: string;
    receptionist_id: string;
    doctor: {
      name: string;
      profile: string;
      specialty: string;
    };
    createdAt: string;
    updatedAt: string;
  }
];

type bookingAppointment = {
  state: string;
  city: string;
  hospital: {
    hospital_id: string;
    hospital_name: string;
    appointment_charge: string;
  };
  disease: string;
  note: string;
};

type BookAppointmentProps = {
  patientId: string;
  name: string;
  email: string;
};

type BookAppointmentHospital = {
  hospital_id: string;
  hospital_name: string;
  appointment_charge: string;
};

type AdditionalNoteProps = {
  additionalNote: string;
  noteError: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

type StateSelectorProps = {
  selectedState: string;
  onStateChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

type CitySelectorProps = {
  selectedState: string;
  selectedCity: string;
  onCityChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isOpenPopover: boolean;
  setIsOpenPopover: (open: boolean) => void;
};

type HospitalSelectorProps = {
  selectedState: string;
  selectedCity: string;
  selectedHospital: BookAppointmentHospital;
  onHospitalChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isOpenHospitalPopover: boolean;
  setIsOpenHospitalPopover: (open: boolean) => void;
};

type DiseaseSelectorProps = {
  selectedHospital: BookAppointmentHospital;
  selectedDisease: string;
  onDiseaseChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isOpenDiseasePopover: boolean;
  setIsOpenDiseasePopover: (open: boolean) => void;
};
