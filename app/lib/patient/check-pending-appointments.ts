export default async function checkPendingAppointments(
  hospital_id: string
): Promise<{ hasPendingAppointment: boolean }> {
  const endpoint = "/api/patient/appointment/pending";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hospital_id }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error?.message || "Failed to check pending appointments"
      );
    }

    return result;
  } catch (error) {
    console.error(
      "An error occurred while fetching pending appointment requests:",
      error
    );
    throw error;
  }
}
