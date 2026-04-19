import { NextResponse } from "next/server";
import { getMealsForUser } from "@/lib/services/user.service";
import { getSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session.isAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user_id } = await request.json();

    // Use the session user ID if not provided in request
    const userId = user_id || session.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    const meals = await getMealsForUser(userId);

    return NextResponse.json({
      success: true,
      meals,
      message: "Meals successfully pulled",
    });
  } catch (error) {
    console.error("Get meals error:", error);
    return NextResponse.json(
      { success: false, meals: [], message: "Error pulling meals" },
      { status: 500 }
    );
  }
}
