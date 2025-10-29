"use server";

import BaseUrl from "@utils/base-url";

export async function loginAction(formData: FormData): Promise<any> {
  const usernameOrEmail = formData.get("usernameOrEmail");
  const password = formData.get("password");
  const role = formData.get("role");

  const endpoint = `${BaseUrl}/api/auth/login`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password, role }),
    });

    const result = await response.json();
    
    // Handle new API response format
    if (!result.success) {
      return { error: { message: result.data } };
    }
    
    return result;
  } catch (error) {
    console.error("An error occurred during login:", error);
    return { error: { message: "Network error occurred" } };
  }
}

export async function signupAction(formData: FormData): Promise<any> {
  const user = {
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const endpoint = `${BaseUrl}/api/auth/signup`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Signup failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred during signup:", error);
    throw error;
  }
}
