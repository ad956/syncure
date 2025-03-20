export default async function updateAddress(filteredFields: any): Promise<any> {
  const endpoint = "/api/update-profile/address";

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
    console.error("Error updating address information:", error);
    throw error;
  }
}
