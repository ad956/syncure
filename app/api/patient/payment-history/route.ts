import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { Patient, Transaction } from "@models/index";
import { Types } from "mongoose";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: Request) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const isPending = status === "pending";

    const patient_id = new Types.ObjectId((session as any).user.id);

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return createErrorResponse("Patient not found", 404);
    }

    // build query
    const query: any = { patient: patient._id };
    if (status) {
      query.status = "Pending";
    }

    // get all transactions where patient ID matches
    const transactions = await Transaction.find(query)
      .populate("hospital", "firstname lastname profile")
      .select(
        isPending
          ? "hospital createdAt amount"
          : "hospital disease description createdAt amount status"
      )
      .sort({ createdAt: -1 });

    const formattedTransactions = transactions.map((transaction) => {
      const formattedData = {
        txnDocumentId: transaction._id,
        hospital: {
          name: `${transaction.hospital.firstname} ${transaction.hospital.lastname}`,
          profile: transaction.hospital.profile,
        },
        date: transaction.createdAt,
        amount: transaction.amount,
      };

      if (!isPending) {
        return {
          ...formattedData,
          disease: transaction.disease || "",
          description: transaction.description || "",
          status: transaction.status,
        };
      }

      return {
        ...formattedData,
        disease: "",
        description: "",
        status: "Pending" as const,
      };
    });

    return createSuccessResponse({
      transactions: formattedTransactions,
      count: formattedTransactions.length
    });
  } catch (error: any) {
    console.error("Error fetching payment data:", error);
    return createErrorResponse("Failed to fetch payment history", 500);
  }
}

