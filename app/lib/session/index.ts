import { SignJWT, jwtVerify } from "jose";
import { JWTExpired, JWTInvalid } from "jose/errors";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret"; //process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("60 minutes from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });

    // checking if token expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new JWTExpired("Token has expired");
    }

    return payload;
  } catch (error) {
    if (error instanceof JWTExpired) {
      console.error("Token has expired:", error.message);
      throw error;
    }
    if (error instanceof JWTInvalid) {
      console.error("Invalid token:", error.message);
      throw error;
    }
    console.error("Error decrypting session token:", error);
    throw error;
  }
}

export async function setSession(id: string, role: string) {
  const user = { id, role };

  // Create the session
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;

  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  try {
    const parsed = await decrypt(session);

    // refresh the session so it doesn't expire
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const newSession = await encrypt(parsed);

    const response = NextResponse.next();

    response.cookies.set({
      name: "session",
      value: newSession,
      expires,
      httpOnly: true,
      path: "/",
    });
    return response;
  } catch (error) {
    throw error;
  }
}
