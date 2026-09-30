export type Meal = {
  category: string;
  date_created: string;
  description: string;
  display_name: string;
  ingredients: string[];
  instructions: string[];
  isActive: boolean;
  tags: string[];
  _id: string;
};

export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_CATEGORIES: { id: MealCategory; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

export const categoryLabel = (category: string): string =>
  MEAL_CATEGORIES.find((entry) => entry.id === category)?.label ?? category;

// Deleting a meal only flags it inactive, and some responses still include it.
export const activeMeals = (meals: Meal[] | undefined): Meal[] =>
  Array.isArray(meals) ? meals.filter((meal) => meal.isActive !== false) : [];
