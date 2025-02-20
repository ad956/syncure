import BaseUrl from "@utils/base-url";

export async function getHospitalsList(
  currentPage: number = 1,
  pageSize: number = 10
): Promise<{
  hospitals: HospitalData[];
  pagination: PaginationMetadata;
}> {
  const endpoint = `${BaseUrl}/api/admin/hospitals?page=${currentPage}&limit=${pageSize}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Failed to fetch hospitals list: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching hospitals list:", error);
    throw error;
  }
}

export async function getHospitalDetails(
  hospitalId: string,
  currentPage: number = 1,
  pageSize: number = 10
): Promise<{
  users: HospitalUserData[];
  pagination: PaginationMetadata;
}> {
  const endpoint = `/api/admin/hospitals/users?hospitalId=${hospitalId}&page=${currentPage}&limit=${pageSize}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch hospital details: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching hospital details:", error);
    throw error;
  }
}
