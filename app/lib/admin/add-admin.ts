export default async function addAdmin(formData: FormData): Promise<any> {
  const endpoint = `/api/admin/add-admin`;

  try {
    const formDataObject = Object.fromEntries(formData.entries());

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(formDataObject),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to add admin: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while adding admin:", error);
    throw error;
  }
}
