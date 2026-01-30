import { connectToDatabase } from "@/lib/db/connection";
import { Calendar } from "@/lib/db/models";

export interface MealSchedule {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snack?: string;
}

export interface DaySchedule extends MealSchedule {
  day: string;
  pulled: boolean;
}

export async function updateCalendarChanges(
  userId: string,
  date: string,
  changes: MealSchedule
): Promise<{ success: boolean; message: string }> {
  await connectToDatabase();

  const dateExists = await Calendar.findOne({ date });

  if (!dateExists) {
    // Create new date entry
    await new Calendar({
      date,
      users: [
        {
          user_id: userId,
          ...changes,
        },
      ],
    }).save();
  } else {
    // Check if user already has entry for this date
    const userExists = await Calendar.findOne({
      date,
      users: { $elemMatch: { user_id: userId } },
    });

    if (userExists) {
      // Update existing user entry
      await Calendar.findOneAndUpdate(
        { date, users: { $elemMatch: { user_id: userId } } },
        { $set: { "users.$": { user_id: userId, ...changes } } },
        { new: true }
      );
    } else {
      // Add new user entry to existing date
      await Calendar.findOneAndUpdate(
        { date },
        { $push: { users: { user_id: userId, ...changes } } },
        { new: true }
      );
    }
  }

  return { success: true, message: "Successfully updated date" };
}

export async function getDateMeals(
  userId: string,
  date: string
): Promise<{ success: boolean; data?: MealSchedule; message?: string }> {
  await connectToDatabase();

  const dateDoc = await Calendar.findOne({
    date,
    users: { $elemMatch: { user_id: userId } },
  });

  if (dateDoc) {
    const userData = dateDoc.users.find(
      (user) => user.user_id?.toString() === userId
    );
    if (userData) {
      return {
        success: true,
        data: {
          breakfast: userData.breakfast,
          lunch: userData.lunch,
          dinner: userData.dinner,
          snack: userData.snack,
        },
      };
    }
  }

  return {
    success: true,
    message: "No data for user on date",
    data: undefined,
  };
}

export async function getWeekSchedule(
  userId: string,
  week: string[]
): Promise<{ success: boolean; meals: DaySchedule[]; message?: string }> {
  await connectToDatabase();

  const weekMeals = await Calendar.find({
    date: { $in: week },
  });

  const returnWeek: DaySchedule[] = week.map((day) => {
    const dateEntry = weekMeals.find((date) => date.date === day);

    if (dateEntry) {
      const userData = dateEntry.users.find(
        (user) => user.user_id?.toString() === userId
      );

      if (userData) {
        return {
          breakfast: userData.breakfast,
          lunch: userData.lunch,
          dinner: userData.dinner,
          snack: userData.snack,
          day,
          pulled: true,
        };
      }
    }

    return { day, pulled: false };
  });

  return {
    success: true,
    meals: returnWeek,
    message: "Schedule retrieved successfully",
  };
}
