import BaseUrl from "@utils/base-url";
import { headers } from "next/headers";

export default async function getReceptionistData(): Promise<Receptionist> {
  const endpoint = `${BaseUrl}/api/receptionist`;

  try {
    const response = await fetch(endpoint, {
      // headers: {
      //   "Cache-Control": "no-cache",
      // },
      headers: headers(),
    });

    const result = await response.json();

    if (result.error) throw new Error(result.error.message);

    return result;
  } catch (error) {
    console.error("Error fetching receptionist data:", error);
    throw error;
  }
}
