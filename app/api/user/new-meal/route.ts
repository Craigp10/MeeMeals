import { NextResponse } from "next/server";
import { createMeal } from "@/lib/services/user.service";
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

    const { user_id, meal } = await request.json();

    // Use the session user ID if not provided in request
    const userId = user_id || session.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    if (!meal) {
      return NextResponse.json(
        { success: false, message: "Meal data required" },
        { status: 400 }
      );
    }

    const result = await createMeal(userId, meal);

    return NextResponse.json({
      success: result.success,
      meals: result.meals,
      message: result.message,
    });
  } catch (error) {
    console.error("Create meal error:", error);
    return NextResponse.json(
      { success: false, message: "Error creating meal" },
      { status: 500 }
    );
  }
}
