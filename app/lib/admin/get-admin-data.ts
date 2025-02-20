// import BaseUrl from "@utils/base-url";

export default async function getAdminData(): Promise<Admin> {
  const endpoint = `/api/admin`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch admin data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching admin data:", error);
    throw error;
  }
}
