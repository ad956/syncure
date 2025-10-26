export default async function getMedications(): Promise<any[]> {
  const endpoint = "/api/patient/medications";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch medications");
    }

    return result.medications || [];
  } catch (error) {
    console.error(
      "An error occurred while fetching medications: ",
      error
    );
    return [];
  }
}