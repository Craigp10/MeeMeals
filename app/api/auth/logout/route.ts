import { NextResponse } from "next/server";
import { getSession, destroySession } from "@/lib/auth/session";
import { deleteDemoUser } from "@/lib/services/auth.service";

export async function GET() {
  try {
    const session = await getSession();

    // If this is a demo user, delete them from the database
    if (session.isDemo && session.sessionId) {
      await deleteDemoUser(session.sessionId);
    }

    // Destroy the session
    await destroySession();

    return NextResponse.json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
