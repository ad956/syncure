import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("better-auth.session_token")?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET || "your-secret-key-here"
    );

    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}