export default async function bookAppointment(
  bookAppointmentData: bookingAppointment
): Promise<any> {
  const endpoint = "/api/patient/appointment";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookAppointmentData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to book appointment");
    }

    return result;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
}
