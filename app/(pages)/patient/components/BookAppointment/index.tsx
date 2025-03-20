"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { ChangeEvent, useState } from "react";
import { Button } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";

import { StateSelector } from "./StateSelector";
import { CitySelector } from "./CitySelector";
import { HospitalSelector } from "./HospitalSelector";
import { DiseaseSelector } from "./DiseaseSelector";
import { AdditionalNote } from "./AdditionalNote";

import checkPendingAppointments from "@lib/patient/check-pending-appointments";
import processPayment from "@lib/razorpay/process-payment";
import saveAppointmentTransaction from "@lib/patient/save-appointment-transaction";
import bookAppointment from "@lib/patient/book-appointment";

export default function BookAppointment({
  patientId,
  name,
  email,
}: BookAppointmentProps) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHospital, setSelectedHospital] =
    useState<BookAppointmentHospital>({
      hospital_id: "",
      hospital_name: "",
      appointment_charge: "",
    });
  const [selectedDisease, setSelectedDisease] = useState("");
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [isOpenHospitalPopover, setIsOpenHospitalPopover] = useState(false);
  const [isOpenDiseasePopover, setIsOpenDiseasePopover] = useState(false);
  const [additionalNote, setAdditionalNote] = useState("");
  const [noteError, setNoteError] = useState("");

  const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedState = e.target.value;
    setSelectedState(selectedState);
    setSelectedCity("");
    setIsOpenPopover(false);
  };

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setIsOpenPopover(false);
  };

  const handleHospitalChange = (hospital: BookAppointmentHospital): void => {
    setSelectedHospital(hospital);
    setIsOpenHospitalPopover(false);
  };

  const handleDiseaseChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedDisease(e.target.value);
    setIsOpenDiseasePopover(false);
  };

  const handleAdditionalNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAdditionalNote(value);
    if (value.length < 10 || value.length > 100) {
      setNoteError("The description should be 10-100 characters long.");
    } else {
      setNoteError("");
    }
  };

  const handleAppointmentButtonClick = async (): Promise<void> => {
    const loadingToast = toast.loading("Checking appointment status...");

    try {
      // Check for existing pending appointments
      const result = await checkPendingAppointments(
        selectedHospital.hospital_id
      );

      if (result.hasPendingAppointment) {
        toast.dismiss(loadingToast);
        toast.error("You already have a pending appointment request");
        return;
      }

      // Update toast to indicate payment is starting
      toast.loading("Initiating payment...", { id: loadingToast });

      setTimeout(() => {
        toast.dismiss(loadingToast);
      }, 2500);

      // Process payment
      let paymentResult;
      try {
        paymentResult = await processPayment(
          name,
          email,
          "Payment for appointment booking",
          selectedHospital.appointment_charge
        );

        // If we reach here, payment process completed (success or failure)
      } catch (paymentError) {
        // Payment was cancelled or failed
        toast.error("Payment was cancelled or could not be processed");
        return;
      }

      if (!paymentResult.success) {
        toast.error(paymentResult.message, {
          duration: 3000,
          position: "bottom-center",
        });
        return;
      }

      // Re-create the loading toast for the next steps
      const postPaymentToast = toast.loading("Recording transaction...");

      // Save transaction details
      await saveAppointmentTransaction(
        paymentResult.transaction_id,
        patientId,
        selectedHospital.hospital_id,
        selectedDisease,
        additionalNote,
        selectedHospital.appointment_charge,
        paymentResult.success ? "Success" : "Failed"
      );

      // Update toast for appointment booking
      toast.loading("Finalizing appointment...", { id: postPaymentToast });

      // Book appointment after payment
      const bookAppointmentData = {
        state: selectedState,
        city: selectedCity,
        hospital: selectedHospital,
        disease: selectedDisease,
        note: additionalNote,
        transaction_id: paymentResult.transaction_id,
      };

      const response = await bookAppointment(bookAppointmentData);

      toast.dismiss(postPaymentToast);

      if (response.error) {
        console.error("Error booking appointment:", response.error);
        toast.error(response.error);
        return;
      }

      clearSelected();
      toast.success(response.message);
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while processing your request");
      console.error("Error:", error);
    }
  };

  const clearSelected = () => {
    setSelectedState("");
    setSelectedCity("");
    setSelectedHospital({
      hospital_id: "",
      hospital_name: "",
      appointment_charge: "",
    });
    setSelectedDisease("");
    setAdditionalNote("");
    setNoteError("");
    setIsOpenPopover(false);
    setIsOpenHospitalPopover(false);
    setIsOpenDiseasePopover(false);
  };

  const isButtonDisabled =
    !selectedState ||
    !selectedCity ||
    !selectedHospital.hospital_id ||
    !selectedDisease ||
    !additionalNote ||
    noteError !== "";

  return (
    <div className="flex flex-col justify-center gap-5 mx-5 mt-10">
      <Toaster />
      <p className="text-lg font-bold">Book an appointment</p>
      <div className="flex flex-col flex-wrap md:flex-row items-center gap-5">
        <StateSelector
          selectedState={selectedState}
          onStateChange={handleStateChange}
        />

        <CitySelector
          selectedState={selectedState}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          isOpenPopover={isOpenPopover}
          setIsOpenPopover={setIsOpenPopover}
        />

        <HospitalSelector
          selectedState={selectedState}
          selectedCity={selectedCity}
          selectedHospital={selectedHospital}
          onHospitalChange={handleHospitalChange}
          isOpenHospitalPopover={isOpenHospitalPopover}
          setIsOpenHospitalPopover={setIsOpenHospitalPopover}
        />

        <DiseaseSelector
          selectedHospital={selectedHospital}
          selectedDisease={selectedDisease}
          onDiseaseChange={handleDiseaseChange}
          isOpenDiseasePopover={isOpenDiseasePopover}
          setIsOpenDiseasePopover={setIsOpenDiseasePopover}
        />
      </div>

      <AdditionalNote
        additionalNote={additionalNote}
        noteError={noteError}
        onChange={handleAdditionalNoteChange}
      />

      <Button
        radius="full"
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg max-w-40 self-center"
        onClick={handleAppointmentButtonClick}
        isDisabled={isButtonDisabled}
      >
        Request Appointment
      </Button>
    </div>
  );
}
