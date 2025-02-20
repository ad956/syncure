"use server";

// import BaseUrl from "@utils/base-url"; // ${BaseUrl}

export async function getTilesData(): Promise<TilesDataType> {
  const endpoint = `/api/admin/dashboard/tiles`;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 5000 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tiles data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching tiles data:", error);
    throw error;
  }
}

export async function getRecentUsersData(
  page: number
): Promise<PaginatedResponse> {
  const endpoint = `/api/admin/dashboard/recent-users?page=${page}&limit=10`;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 5000 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch recent users data: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching recent users data:", error);
    throw error;
  }
}
