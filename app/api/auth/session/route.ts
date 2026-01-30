import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();

    return NextResponse.json({
      isAuth: session.isAuth,
      user: session.user,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { isAuth: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
