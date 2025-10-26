import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import { Patient, Transaction } from "@models/index";
import { Types } from "mongoose";
import { getSession } from "@lib/auth/get-session";
import { paymentHistoryResponseSchema } from "@lib/validations/patient";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  try {
    const isPending = status === "pending";

    const patient_id = new Types.ObjectId((session as any).user.id);
    await dbConfig();

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return errorHandler("Patient not found", STATUS_CODES.NOT_FOUND);
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

    // Validate response data
    const validatedData = paymentHistoryResponseSchema.parse(formattedTransactions);
    return NextResponse.json(validatedData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching payment data:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}

