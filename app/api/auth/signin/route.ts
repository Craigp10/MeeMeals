import { NextResponse } from "next/server";
import { signinUser } from "@/lib/services/auth.service";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await signinUser(username, password);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          error_code: result.errorCode,
        },
        { status: 202 }
      );
    }

    // Create session for the user
    if (result.user) {
      await createSession(result.user, false);
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      id: result.user?.id,
      username: result.user?.username,
      email: result.user?.email,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
