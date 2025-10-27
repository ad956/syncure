interface PendingBill {
  _id: string;
  amount: number;
  date: string;
  hospital: string;
  status: string;
}

export default async function getPendingBills(): Promise<[PendingBill]> {
  const endpoint = "/api/patient/payment-history?status=pending";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch pending bills");
    }

    return result;
  } catch (error) {
    console.error(
      "An error occurred while fetching pending bills of patient : ",
      error
    );
    throw error;
  }
}
