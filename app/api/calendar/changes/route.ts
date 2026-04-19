import { NextResponse } from "next/server";
import { updateCalendarChanges } from "@/lib/services/calendar.service";
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

    const { user_id, date, changes } = await request.json();

    // Use the session user ID if not provided in request
    const userId = user_id || session.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    if (!date || !changes) {
      return NextResponse.json(
        { success: false, message: "Date and changes required" },
        { status: 400 }
      );
    }

    const result = await updateCalendarChanges(userId, date, changes);

    return NextResponse.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Update calendar error:", error);
    return NextResponse.json(
      { success: false, message: "Error updating calendar" },
      { status: 500 }
    );
  }
}
