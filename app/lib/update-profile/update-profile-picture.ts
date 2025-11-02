export default async function updateProfilePicture(
  profile_url: string
): Promise<any> {
  const endpoint = "/api/update-profile/picture";

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profile_picture: profile_url }),
    });

    const result = await response.json();

    if (result.error) return { error: result.error.message };

    return result;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
}
