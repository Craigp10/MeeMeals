import { NextResponse } from "next/server";
import { signupUser } from "@/lib/services/auth.service";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await signupUser(username, email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Create session for the new user
    if (result.user) {
      await createSession(result.user, false);
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
