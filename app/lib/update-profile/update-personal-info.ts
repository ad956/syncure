export default async function updatePersonal(
  filteredFields: any
): Promise<any> {
  const endpoint = "/api/update-profile/personal";

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredFields),
    });

    const result = await response.json();

    if (result.error) return { error: result.error.message };

    return result;
  } catch (error) {
    console.error("Error updating personal information:", error);
    throw error;
  }
}
