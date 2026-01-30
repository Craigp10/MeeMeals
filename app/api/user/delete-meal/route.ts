import { NextResponse } from "next/server";
import { deleteMeal } from "@/lib/services/user.service";
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

    const { user_id, meal_id } = await request.json();

    // Use the session user ID if not provided in request
    const userId = user_id || session.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    if (!meal_id) {
      return NextResponse.json(
        { success: false, message: "Meal ID required" },
        { status: 400 }
      );
    }

    const result = await deleteMeal(userId, meal_id);

    return NextResponse.json({
      success: result.success,
      meals: result.meals,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete meal error:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting meal" },
      { status: 500 }
    );
  }
}
