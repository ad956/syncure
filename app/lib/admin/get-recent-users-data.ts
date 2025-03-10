export default async function getRecentUsersData(
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
