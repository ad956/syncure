import { NextRequest } from "next/server";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const results = {
      email: { success: false, error: null },
      novu: { success: false, error: null },
      pdf: { success: false, error: null, url: null as string | null }
    };

    // Test Email with PDF attachment
    try {
      const { sendEmail, AppointmentBookedTemplate } = await import("@lib/emails");
      const { render } = await import("@react-email/render");
      const { generateBillPDF } = await import("@lib/pdf/bill-template");
      
      interface BillData {
        patientName: string;
        patientEmail: string;
        hospitalName: string;
        disease: string;
        note: string;
        amount: number;
        transactionId: string;
        date: string;
        billId: string;
      }
      const { uploadPDFToCloudinary } = await import("@lib/pdf/cloudinary-upload");

      const emailHtml = render(
        AppointmentBookedTemplate({
          name: "Test User",
          email: "test@example.com",
          bookedAppointmentData: {
            disease: "Test Disease",
            note: "Test appointment note",
            hospital: {
              hospital_name: "Test Hospital",
              appointment_charge: 500,
            },
          },
          transaction_id: "test_txn_123",
        })
      );

      // Generate PDF
      const billData: BillData = {
        patientName: "Test User",
        patientEmail: "test@example.com",
        hospitalName: "Test Hospital",
        disease: "Test Disease",
        note: "Test appointment note",
        amount: 500,
        transactionId: "test_txn_123",
        date: new Date().toLocaleDateString(),
        billId: "BILL-TEST123"
      };

      const pdfDoc = generateBillPDF(billData);
      const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
      const fileName = `test-bill-${Date.now()}.pdf`;
      
      const billUrl = await uploadPDFToCloudinary(pdfBuffer, fileName);
      console.log('PDF uploaded to:', billUrl);
      results.pdf = { success: true, error: null, url: billUrl };

      await sendEmail({
        to: "anandsuthar956@gmail.com",
        subject: "Test Email - Syncure",
        html: emailHtml,
        from: {
          name: "Syncure",
          address: "support@syncure.com",
        },
        attachments: [{
          filename: "payment-receipt.pdf",
          content: pdfBuffer
        }]
      });

      results.email.success = true;
    } catch (emailError: any) {
      results.email.error = emailError.message;
      console.error("Email test failed:", emailError);
    }

    // Test Novu
    try {
      const sendNotification = (await import("@lib/novu")).default;
      await sendNotification(
        "66b72552fc219b2351f1717e",
        "Test notification from Syncure - appointment booking system",
        "appointment-request"
      );
      results.novu.success = true;
    } catch (novuError: any) {
      results.novu.error = novuError.message;
      console.error("Novu test failed:", novuError);
    }

    return createSuccessResponse(results, "Notification tests completed");
  } catch (error: any) {
    console.error("Test API error:", error);
    return createErrorResponse("Test failed", 500, error.message);
  }
}