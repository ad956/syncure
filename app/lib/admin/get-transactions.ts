import { cache } from "react";
import dbConfig from "@utils/db";
import { Types } from "mongoose";
import { Admin, Transaction, Patient, Hospital } from "@models/index";
import { auth } from "../auth";

const getTransactions = cache(async () => {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    await dbConfig();

    const admin_id: any = new Types.ObjectId(session.user.id);
    const adminData = await Admin.findById(admin_id);

    if (!adminData) {
      throw new Error("Admin not found");
    }

    const transactions = await Transaction.find({}).sort({ createdAt: -1 });

    const transactionDetails: TransactionDetails[] = await Promise.all(
      transactions.map(async (transaction) => {
        const patient = await Patient.findById(transaction.patient);
        const hospital = await Hospital.findById(transaction.hospital);

        return {
          transaction_id: transaction.transaction_id,
          patient: {
            name: `${patient?.firstname} ${patient?.lastname}` || "",
            profile: patient?.profile || "",
          },
          hospital: {
            name: `${hospital?.firstname} ${hospital?.lastname}` || "",
            profile: hospital?.profile || "",
          },
          disease: transaction.disease,
          description: transaction.description,
          amount: transaction.amount,
          status: transaction.status,
          date: transaction.createdAt.toISOString(),
        };
      })
    );

    return JSON.parse(JSON.stringify(transactionDetails));
  } catch (error) {
    console.error("An error occurred while fetching transactions data:", error);
    throw error;
  }
});

export default getTransactions;
