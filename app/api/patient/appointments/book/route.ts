import { NextRequest } from "next/server";
import BookedAppointment from "@models/booked-appointment";
import FamilyMember from "@models/family-member";
import CityStateHospital from "@models/city-state-hospitals";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@lib/api-response";
import { bookAppointmentSchema } from "@lib/validations/patient";
import { z } from "zod";
import { generateBillPDF, BillData } from "@lib/pdf/bill-template";
import { uploadPDFToCloudinary } from "@lib/pdf/cloudinary-upload";

// Type for email template
type bookingAppointment = {
  disease: string;
  note: string;
  hospital: {
    hospital_name: string;
    appointment_charge: number;
  };
};

const bookAppointmentWithPaymentSchema = bookAppointmentSchema.extend({
  razorpayPaymentId: z.string().min(1, "Payment ID is required"),
  razorpayOrderId: z.string().min(1, "Order ID is required"),
  razorpaySignature: z.string().min(1, "Payment signature is required")
});

export async function POST(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const body = await request.json();
    
    // Validate request body with Zod
    const validation = bookAppointmentWithPaymentSchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.errors);
    }

    const data = validation.data;
    const patientId = new Types.ObjectId((session as any).user.id);

    // Verify payment first
    const paymentVerification = await fetch(`${request.nextUrl.origin}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCreationId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature
      })
    });

    const paymentResult = await paymentVerification.json();
    if (!paymentResult.isOk) {
      return createErrorResponse("Payment verification failed", 400);
    }

    // Get hospital details and appointment charge
    const hospitalDoc = await CityStateHospital.findOne({
      [data.state]: { $exists: true }
    }).lean();
    if (!hospitalDoc) {
      return createErrorResponse("Hospital data not found", 404);
    }
    
    const hospitals = (hospitalDoc as any)[data.state]?.[data.city] || [];
    const hospital = hospitals.find((h: any) => h.hospital_name === data.hospital.name);
    
    if (!hospital) {
      return createErrorResponse("Hospital not found", 404);
    }

    // Handle family member booking
    let bookedFor: any = { type: 'self' as const };
    if (data.patient_id && data.patient_id !== 'self' && data.patient_id !== (session as any).user.id) {
      // Validate family member ID
      if (!Types.ObjectId.isValid(data.patient_id)) {
        return createErrorResponse("Invalid family member selection", 400);
      }
      
      // Verify family member exists and belongs to current user
      const familyMember = await FamilyMember.findOne({
        _id: new Types.ObjectId(data.patient_id),
        patient_id: patientId,
        is_active: true
      });

      if (!familyMember) {
        return createErrorResponse("Family member not found", 404);
      }

      bookedFor = {
        type: 'family',
        family_member_id: familyMember._id,
        patient_name: (data as any).patient_name || familyMember.name,
        patient_relation: (data as any).patient_relation || familyMember.relation
      };
    }

    // Create appointment
    const appointment = new BookedAppointment({
      date: new Date(data.date),
      timing: data.timing,
      state: data.state,
      city: data.city,
      hospital: {
        id: data.hospital.id,
        name: data.hospital.name
      },
      disease: data.disease,
      note: data.note || '',
      approved: 'pending',
      patient_id: patientId,
      booked_for: bookedFor,
      payment: {
        razorpayPaymentId: data.razorpayPaymentId,
        razorpayOrderId: data.razorpayOrderId,
        amount: hospital.appointment_charge,
        status: 'completed'
      }
    });

    const savedAppointment = await appointment.save();

    // Generate and upload PDF bill in background
    setImmediate(async () => {
      try {
        const billData: BillData = {
          patientName: `${(session as any).user.firstname || 'Patient'}`,
          patientEmail: (session as any).user.email,
          hospitalName: savedAppointment.hospital.name,
          disease: savedAppointment.disease,
          note: savedAppointment.note || '',
          amount: hospital.appointment_charge,
          transactionId: data.razorpayPaymentId,
          date: new Date().toLocaleDateString(),
          billId: `BILL-${savedAppointment._id.toString().slice(-8).toUpperCase()}`
        };

        const pdfDoc = generateBillPDF(billData);
        const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
        const fileName = `bill-${savedAppointment._id}-${Date.now()}.pdf`;
        
        const billUrl = await uploadPDFToCloudinary(pdfBuffer, fileName);
        
        // Update appointment with bill URL
        await BookedAppointment.findByIdAndUpdate(savedAppointment._id, {
          bill_receipt_url: billUrl
        });
      } catch (pdfError) {
        console.error('Failed to generate/upload bill PDF:', pdfError);
      }
    });

    // Send confirmation email and notification in background (non-blocking)
    setImmediate(async () => {
      try {
        const { sendEmail, AppointmentBookedTemplate } = await import('@lib/emails');
        const { render } = await import('@react-email/render');
        
        const emailHtml = render(AppointmentBookedTemplate({
          name: `${(session as any).user.firstname || 'Patient'}`,
          email: (session as any).user.email,
          bookedAppointmentData: {
            disease: savedAppointment.disease,
            note: savedAppointment.note || '',
            hospital: {
              hospital_name: savedAppointment.hospital.name,
              appointment_charge: hospital.appointment_charge
            }
          },
          transaction_id: data.razorpayPaymentId
        }));

        // Wait for PDF to be generated and get URL
        await new Promise(resolve => setTimeout(resolve, 2000));
        const updatedAppointment = await BookedAppointment.findById(savedAppointment._id);
        
        const emailOptions: any = {
          to: (session as any).user.email,
          subject: 'Appointment Confirmation - Syncure',
          html: emailHtml,
          from: {
            name: 'Syncure',
            address: 'support@syncure.com',
          },
        };

        // Attach PDF if available
        if (updatedAppointment?.bill_receipt_url) {
          emailOptions.attachments = [{
            filename: `receipt-${savedAppointment._id}.pdf`,
            path: updatedAppointment.bill_receipt_url
          }];
        }

        await sendEmail(emailOptions);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      try {
        const sendNotification = (await import('@lib/novu')).default;
        await sendNotification(
          patientId.toString(),
          `Your appointment for ${savedAppointment.disease} at ${savedAppointment.hospital.name} has been booked successfully. Payment ID: ${data.razorpayPaymentId}`,
          'appointment-request'
        );
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }
    });

    const response = createSuccessResponse({
      appointment: {
        id: savedAppointment._id,
        date: savedAppointment.date,
        timing: savedAppointment.timing,
        hospital: savedAppointment.hospital,
        disease: savedAppointment.disease,
        approved: savedAppointment.approved,
        booked_for: savedAppointment.booked_for,
        amount: hospital.appointment_charge
      }
    });

    return response;

  } catch (error: any) {
    console.error("Error booking appointment:", { error: error.message, stack: error.stack });
    return createErrorResponse("Failed to book appointment", 500);
  }
}