import BaseUrl from "@utils/base-url";

export default async function getPatientData(): Promise<Patient> {
  const endpoint = `${BaseUrl}/api/patient`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch patient data");
    }

    console.log("data " + result);

    return result;
  } catch (error) {
    console.error("An error occurred while fetching patient data:", error);
    throw error;
  }
}
