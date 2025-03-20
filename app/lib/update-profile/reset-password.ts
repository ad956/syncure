export default async function resetPassword(
  currentPassword: string,
  newPassword: string
): Promise<any> {
  const endpoint = "/api/update-profile/reset-password";

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();

    if (result.error) return { error: result.error.message };

    return result;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}
