import { NextResponse } from "next/server";
import { getDateMeals } from "@/lib/services/calendar.service";
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

    const { user_id, date } = await request.json();

    // Use the session user ID if not provided in request
    const userId = user_id || session.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { success: false, message: "Date required" },
        { status: 400 }
      );
    }

    const result = await getDateMeals(userId, date);

    return NextResponse.json({
      success: result.success,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    console.error("Get date meals error:", error);
    return NextResponse.json(
      { success: false, message: "Error pulling date meals" },
      { status: 500 }
    );
  }
}
