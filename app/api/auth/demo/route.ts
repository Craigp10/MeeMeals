import { NextResponse } from "next/server";
import { createDemoUser } from "@/lib/services/auth.service";
import { createSession } from "@/lib/auth/session";

export async function GET() {
  try {
    // Generate a unique session ID for the demo user
    const sessionId = crypto.randomUUID();

    const user = await createDemoUser(sessionId);

    // Create session for the demo user
    await createSession(user, true);

    return NextResponse.json({
      success: true,
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Demo signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
