import { auth } from "@lib/auth";

export async function getSession() {
  try {
    const session = await auth.api.getSession();
    return session;
  } catch (error) {
    return null;
  }
}