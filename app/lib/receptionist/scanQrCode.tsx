"use server";

import fetchHandler from "@utils/fetchHandler";
import { getSessionToken } from "../sessions/sessionUtils";

export default async function scanQRCode(
  email: string
): Promise<{ message: string }> {
  const endpoint = "/api/receptionist/scan";
  const session = getSessionToken();

  try {
    const result = await fetchHandler<{ message: string }>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
      session!
    );

    return result.data!;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
