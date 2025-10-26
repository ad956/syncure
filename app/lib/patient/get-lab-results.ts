export default async function getLabResults(): Promise<any[]> {
  const endpoint = "/api/patient/lab-results";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch lab results");
    }

    return result.labResults || [];
  } catch (error) {
    console.error(
      "An error occurred while fetching lab results: ",
      error
    );
    return [];
  }
}