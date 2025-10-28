import { NextResponse } from "next/server";
import Transaction from "@models/transaction";
import "@models/hospital";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { requireAuth } from "@lib/auth/api-auth";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";



export async function GET() {
  try {
    await dbConfig();
    const { error, session } = requireAuth();
    
    if (error) {
      return error;
    }

    const patientId = new Types.ObjectId((session as any).user.id);
    console.log("Bills API - Patient ID:", patientId.toString());

    const pendingBills = await Transaction.find({
      patient: patientId,
      status: "Pending",
    })
      .populate({
        path: 'hospital',
        select: 'firstname lastname profile'
      })
      .sort({ createdAt: -1 })
      .limit(5);

    console.log("Bills found:", pendingBills.length);
    if (pendingBills.length === 0) {
      const allBills = await Transaction.find({ patient: patientId }).lean();
      console.log("Total bills for patient:", allBills.length);
      if (allBills.length > 0) {
        console.log("Sample bill:", allBills[0]);
      }
    }

    const formattedBills = pendingBills.map((bill) => ({
      _id: bill._id,
      hospital: {
        name: bill.hospital
          ? `${bill.hospital.firstname} ${bill.hospital.lastname}`
          : "Unknown Hospital",
        profile: bill.hospital?.profile || null,
      },
      amount: bill.amount,
      date: bill.createdAt,
      txnDocumentId: bill._id,
    }));

    const response = createSuccessResponse({
      bills: formattedBills,
      count: formattedBills.length,
    });
    
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error: any) {
    console.error("Error fetching pending bills:", error);
    return createErrorResponse(
      "Failed to fetch bills", 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}
