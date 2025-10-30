"use client";

import { useState } from "react";
import { Button, Select, SelectItem, Input, Textarea, Card, CardBody } from "@nextui-org/react";
import { Formik, Form, Field } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { bookAppointmentSchema, type BookAppointment } from "@lib/validations/patient";
import { useStates, useCities, useHospitals } from "@hooks/useLocations";
import { useAppointments } from "@hooks/useAppointments";
import { FamilyMemberSelector } from "./FamilyMemberSelector";
import { PendingAppointmentsList } from "./PendingAppointmentsList";
import { DateTimeSelector } from "./DateTimeSelector";
import SpinnerLoader from "@components/SpinnerLoader";

interface BookAppointmentProps {
  patientId: string;
  name: string;
  email: string;
}

export default function BookAppointment({
  patientId,
  name,
  email,
}: BookAppointmentProps) {
  const { states, isLoading: statesLoading } = useStates();
  const [selectedState, setSelectedState] = useState("");
  const { cities, isLoading: citiesLoading } = useCities(selectedState);
  const [selectedCity, setSelectedCity] = useState("");
  const { hospitals, isLoading: hospitalsLoading } = useHospitals(selectedState, selectedCity);
  const [isBooking, setIsBooking] = useState(false);
  const { bookAppointment } = useAppointments();

  const handleSubmit = async (values: any) => {
    try {
      console.log('=== BOOKING STARTED ===');
      console.log('Form values:', values);
      
      if (!values.date || !values.timing.startTime || !values.hospital.id || !values.disease) {
        console.log('Missing required fields');
        toast.error('Please fill all required fields');
        return;
      }
      
      setIsBooking(true);
      toast.loading('Preparing payment...', { id: 'booking' });
      
      // Get appointment charge
      console.log('Fetching charge...');
      const chargeResponse = await fetch(`/api/patient/appointments/get-charge?state=${values.state}&city=${values.city}&hospitalName=${values.hospital.name}`);
      console.log('Charge response status:', chargeResponse.status);
      const chargeData = await chargeResponse.json();
      console.log('Charge data:', chargeData);
      
      if (!chargeData.success) {
        toast.error('Failed to get appointment charge', { id: 'booking' });
        setIsBooking(false);
        return;
      }

      const amount = parseInt(chargeData.data.appointmentCharge) * 100; // Convert to paise

      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount.toString(), currency: 'INR' })
      });
      
      const orderData = await orderResponse.json();
      if (!orderData.orderId) {
        toast.error('Failed to create payment order', { id: 'booking' });
        setIsBooking(false);
        return;
      }

      toast.success('Opening payment gateway...', { id: 'booking' });

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        name: 'Syncure',
        description: 'Appointment Booking',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Book appointment with payment details
            const bookingData = await bookAppointment({
              date: values.date,
              timing: values.timing,
              state: values.state,
              city: values.city,
              hospital: values.hospital,
              disease: values.disease,
              note: values.note,
              patient_id: values.patient_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });
            if (bookingData.success) {
              toast.success('Appointment booked successfully!');
              // Reset form manually since resetForm is not available here
              window.location.reload();
            } else {
              const errorMsg = bookingData.error || 'Failed to book appointment';
              toast.error(errorMsg, { duration: 6000 });
              console.error('Booking error details:', bookingData.details);
            }
            setIsBooking(false);
          } catch (error) {
            console.error('Booking error:', error);
            toast.error('Network error. Please check your connection and try again.');
            setIsBooking(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setIsBooking(false);
          }
        }
      };

      console.log('Razorpay options:', options);
      console.log('Window Razorpay:', (window as any).Razorpay);
      
      if (!(window as any).Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh and try again.', { id: 'booking' });
        setIsBooking(false);
        return;
      }
      
      const razorpay = new (window as any).Razorpay(options);
      console.log('Razorpay instance created:', razorpay);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.', { id: 'booking' });
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto p-4 pb-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Schedule Your Appointment</h1>
          <p className="text-gray-600">Connect with healthcare professionals in just a few clicks</p>
        </div>

        <Formik
          initialValues={{
            date: '',
            timing: { startTime: '', endTime: '' },
            state: '',
            city: '',
            hospital: { id: '', name: '' },
            disease: '',
            note: '',
            patient_id: 'self',
          }}
          validate={(values) => {
            const validation = bookAppointmentSchema.safeParse({
              patient_id: values.patient_id,
              hospital_id: values.hospital.id,
              disease: values.disease,
              note: values.note
            });
            
            if (!validation.success) {
              const errors: any = {};
              validation.error.errors.forEach((err) => {
                const path = err.path.join('.');
                errors[path] = err.message;
              });
              return errors;
            }
            return {};
          }}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, resetForm }) => (
            <Form>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Left Side - Visual Card */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                    <CardBody className="p-4">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Book Your Healthcare Visit</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">Schedule appointments with top doctors and specialists. Get quality healthcare when you need it most.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg border border-white/50">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Instant Confirmation</p>
                            <p className="text-xs text-gray-600">Get booking confirmation immediately</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg border border-white/50">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Email Confirmation</p>
                            <p className="text-xs text-gray-600">Receive detailed appointment info via email</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg border border-white/50">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Expert Doctors</p>
                            <p className="text-xs text-gray-600">Book with qualified specialists</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg border border-white/50">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenoevenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Flexible Scheduling</p>
                            <p className="text-xs text-gray-600">Choose your preferred date and time</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <p className="font-medium text-green-800 text-sm">What happens next?</p>
                        </div>
                        <p className="text-green-700 text-xs leading-relaxed">
                          After booking, you&apos;ll receive a confirmation email with appointment details, doctor information, and hospital directions.
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                  
                  {/* Pending Appointments Card */}
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                    <CardBody className="p-4">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900">Pending Appointments</h3>
                        <p className="text-xs text-gray-600 mt-1">Your recent appointment requests</p>
                      </div>
                      <PendingAppointmentsList />
                    </CardBody>
                  </Card>
                </div>
                
                {/* Right Side - Form */}
                <div className="lg:col-span-3 space-y-3">
                  {/* Patient Information */}
                  <Card className="shadow-md border-0">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-900">Patient Information</h3>
                      </div>
                      <FamilyMemberSelector
                        selectedMember={values.patient_id}
                        onMemberChange={(id) => setFieldValue('patient_id', id)}
                      />
                    </CardBody>
                  </Card>

                  {/* Date & Time */}
                  <Card className="shadow-md border-0">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-900">Schedule Details</h3>
                      </div>
                      <DateTimeSelector
                        selectedDate={values.date}
                        selectedTime={values.timing}
                        onDateChange={(date) => setFieldValue('date', date)}
                        onTimeChange={(time) => setFieldValue('timing', time)}
                      />
                    </CardBody>
                  </Card>


                  {/* Location */}
                  <Card className="shadow-md border-0">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-900">Location & Hospital</h3>
                      </div>
                      <div className="space-y-3">
                        <Select
                          label="State"
                          selectedKeys={values.state ? new Set([states.find(s => s.name === values.state)?.id || '']) : new Set()}
                          onSelectionChange={(keys) => {
                            const selectedKeys = Array.from(keys);
                            const stateId = selectedKeys[0] as string;
                            const selectedStateObj = states.find(s => s.id === stateId);
                            setFieldValue('state', selectedStateObj?.name || '');
                            setSelectedState(selectedStateObj?.name || '');
                            setFieldValue('city', '');
                            setSelectedCity('');
                            setFieldValue('hospital', { id: '', name: '' });
                          }}
                          variant="bordered"
                          placeholder={statesLoading ? "Loading states..." : "Choose state"}
                          isLoading={statesLoading}
                          size="sm"
                        >
                          {states.map((state: any) => (
                            <SelectItem key={state.id} value={state.id}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          label="City"
                          selectedKeys={values.city ? new Set([cities.find(c => c.name === values.city)?.id || '']) : new Set()}
                          onSelectionChange={(keys) => {
                            const selectedKeys = Array.from(keys);
                            const cityId = selectedKeys[0] as string;
                            const selectedCityObj = cities.find(c => c.id === cityId);
                            const cityName = selectedCityObj?.name || '';
                            setFieldValue('city', cityName);
                            setSelectedCity(cityName);
                            setFieldValue('hospital', { id: '', name: '' });
                          }}
                          isDisabled={!values.state}
                          variant="bordered"
                          placeholder={citiesLoading ? "Loading cities..." : "Choose city"}
                          isLoading={citiesLoading}
                          size="sm"
                        >
                          {cities.map((city: any) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          label="Hospital"
                          selectedKeys={values.hospital.name ? new Set([hospitals.find(h => h.name === values.hospital.name)?.id || '']) : new Set()}
                          onSelectionChange={(keys) => {
                            const selectedKeys = Array.from(keys);
                            const hospitalId = selectedKeys[0] as string;
                            const hospital = hospitals.find((h: any) => h.id === hospitalId);
                            setFieldValue('hospital', {
                              id: hospitalId,
                              name: hospital?.name || ''
                            });
                          }}
                          isDisabled={!values.city}
                          variant="bordered"
                          placeholder={hospitalsLoading ? "Loading hospitals..." : "Choose hospital"}
                          isLoading={hospitalsLoading}
                          size="sm"
                        >
                          {hospitals.map((hospital: any) => (
                            <SelectItem key={hospital.id} value={hospital.id}>
                              {hospital.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Medical Information */}
                  <Card className="shadow-md border-0">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-600 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-900">Medical Information</h3>
                      </div>
                      <div className="space-y-3">
                        <Input
                          label="Condition/Symptoms"
                          value={values.disease}
                          onChange={(e) => setFieldValue('disease', e.target.value)}
                          isInvalid={touched.disease && !!errors.disease}
                          errorMessage={touched.disease && errors.disease}
                          variant="bordered"
                          placeholder="Fever, Headache..."
                          size="sm"
                        />
                        <Textarea
                          label="Notes (Optional)"
                          value={values.note}
                          onChange={(e) => setFieldValue('note', e.target.value)}
                          rows={2}
                          variant="bordered"
                          placeholder="Additional details..."
                          size="sm"
                        />
                      </div>
                    </CardBody>
                  </Card>

                  {/* Submit Section */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                    <Button
                      onPress={() => handleSubmit(values)}
                      isDisabled={isBooking || !values.date || !values.timing.startTime || !values.hospital.id || !values.disease}

                      className="w-64 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                      size="lg"
                    >
                      {isBooking ? (
                        <div className="w-8 h-8">
                          <SpinnerLoader />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Book Appointment</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}