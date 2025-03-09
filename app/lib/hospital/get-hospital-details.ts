export default async function getHospitalDetails(): Promise<HospitalDetailsType> {
  const endpoint = "/api/hospital/additional-details";

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
        result.error?.message || "Failed to fetch hospital details"
      );
    }

    return result.data;
  } catch (error) {
    console.error(
      "An error occurred while fetching hospital additional details:",
      error
    );
    throw error;
  }
}
