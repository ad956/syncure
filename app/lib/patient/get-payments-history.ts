import { cache } from "react";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { Patient, Transaction } from "@models/index";

const getPaymentsHistory = cache(async (patientId: string | undefined) => {
  try {
    const status = "";
    const isPending = ""; //status === "pending";

    const patient_id = new Types.ObjectId(patientId);
    await dbConfig();

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      throw new Error("Patient not found");
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

    const formattedTransactions = transactions.map((transaction: any) => {
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
          disease: transaction.disease,
          description: transaction.description,
          status: transaction.status,
        };
      }

      return formattedData;
    });

    return JSON.parse(JSON.stringify(formattedTransactions));
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
});

export default getPaymentsHistory;
