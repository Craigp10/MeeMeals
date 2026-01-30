import { NextResponse } from "next/server";
import { getWeekSchedule } from "@/lib/services/calendar.service";
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

    const { user_id, week } = await request.json();

    // Use the session user ID if not provided in request
    const userId = user_id || session.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    if (!week || !Array.isArray(week)) {
      return NextResponse.json(
        { success: false, message: "Week array required" },
        { status: 400 }
      );
    }

    const result = await getWeekSchedule(userId, week);

    return NextResponse.json({
      success: result.success,
      meals: result.meals,
      message: result.message,
    });
  } catch (error) {
    console.error("Get schedule error:", error);
    return NextResponse.json(
      { success: false, message: "Error pulling schedule" },
      { status: 500 }
    );
  }
}
