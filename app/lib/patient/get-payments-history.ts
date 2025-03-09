export default async function getPaymentsHistory(): Promise<[Payment]> {
  const endpoint = "/api/patient/payment-history";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error?.message || "Failed to fetch payments history"
      );
    }

    return result;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
}
