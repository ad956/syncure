import { NextResponse } from "next/server";
import { Novu } from "@novu/node";
import { getSession } from "@lib/auth/get-session";

const novu = new Novu(process.env.NOVU_API_KEY || "");

export async function POST() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await novu.subscribers.identify((session as any).user.id, {
      firstName: (session as any).user.name,
      email: (session as any).user.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to create Novu subscriber:", error);
    return NextResponse.json({ error: "Failed to setup notifications" }, { status: 500 });
  }
}