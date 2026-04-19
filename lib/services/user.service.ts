import dayjs from "dayjs";
import { connectToDatabase } from "@/lib/db/connection";
import { User } from "@/lib/db/models";
import type { IMeal } from "@/lib/db/models/user.model";

export async function getMealsForUser(userId: string): Promise<IMeal[]> {
  await connectToDatabase();

  const user = await User.findById(userId);

  if (!user) {
    return [];
  }

  return user.meals.filter((meal) => meal.isActive);
}

export async function createMeal(
  userId: string,
  mealData: Omit<IMeal, "_id" | "isActive" | "date_created">
): Promise<{ success: boolean; meals: IMeal[]; message: string }> {
  await connectToDatabase();

  const meal: Omit<IMeal, "_id"> = {
    ...mealData,
    date_created: dayjs().format("M/D/YYYY"),
    isActive: true,
  };

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { meals: meal } },
    { new: true }
  );

  if (!updatedUser) {
    return { success: false, meals: [], message: "User not found" };
  }

  return {
    success: true,
    meals: updatedUser.meals.filter((m) => m.isActive),
    message: "Meal successfully created",
  };
}

export async function editMeal(
  userId: string,
  mealData: IMeal
): Promise<{ success: boolean; meals: IMeal[]; message: string }> {
  await connectToDatabase();

  const meal: IMeal = {
    ...mealData,
    date_created: dayjs().format("M/D/YYYY"),
    isActive: true,
  };

  await User.findOneAndUpdate(
    { _id: userId, meals: { $elemMatch: { _id: meal._id } } },
    { $set: { "meals.$": meal } },
    { new: true }
  );

  const updatedUser = await User.findById(userId);

  if (!updatedUser) {
    return { success: false, meals: [], message: "User not found" };
  }

  return {
    success: true,
    meals: updatedUser.meals.filter((m) => m.isActive),
    message: "Meal successfully updated",
  };
}

export async function deleteMeal(
  userId: string,
  mealId: string
): Promise<{ success: boolean; meals: IMeal[]; message: string }> {
  await connectToDatabase();

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, meals: { $elemMatch: { _id: mealId } } },
    { $set: { "meals.$.isActive": false } },
    { new: true }
  );

  if (!updatedUser) {
    return { success: false, meals: [], message: "User or meal not found" };
  }

  return {
    success: true,
    meals: updatedUser.meals.filter((m) => m.isActive),
    message: "Meal successfully deleted",
  };
}
