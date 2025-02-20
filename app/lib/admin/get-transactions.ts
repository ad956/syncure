import BaseUrl from "@utils/base-url";

export default async function getTransactions(): Promise<TransactionDetails[]> {
  const endpoint = `${BaseUrl}/api/admin/transactions`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch transactions data: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching transactions data:", error);
    throw error;
  }
}
