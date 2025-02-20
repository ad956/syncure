import BaseUrl from "@utils/base-url";
// import { headers } from "next/headers";

export default async function getUpcomingAppointments(): Promise<bookedAppointments> {
  const endpoint = `${BaseUrl}/api/patient/appointment`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      // headers: headers(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error?.message || "Failed to fetch upcoming appointments"
      );
    }

    return result;
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    throw error;
  }
}
