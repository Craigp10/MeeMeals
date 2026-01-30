import { Types } from "mongoose";

export interface Meal {
  _id?: Types.ObjectId | string;
  isActive: boolean;
  display_name: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  category: string;
  description: string;
  date_last_eaten?: string;
  date_created: string;
}

export interface User {
  _id?: Types.ObjectId | string;
  username: string;
  email: string;
  password: string;
  date_created: string;
  meals: Meal[];
  is_demo: boolean;
  roles?: Types.ObjectId[];
}

export interface CalendarEntry {
  _id?: Types.ObjectId | string;
  user_id: Types.ObjectId | string;
  date: string;
  meals: Types.ObjectId[] | string[];
}

export interface SessionUser {
  id: string;
  username: string;
  email: string;
}

export interface SessionData {
  isAuth: boolean;
  user?: SessionUser;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface MealsResponse {
  success: boolean;
  meals: Meal[];
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: SessionUser;
  isAuth?: boolean;
}

// Request Types
export interface CreateMealRequest {
  user_id: string;
  meal: Omit<Meal, "_id" | "isActive" | "date_created">;
}

export interface EditMealRequest {
  user_id: string;
  meal: Meal;
}

export interface DeleteMealRequest {
  user_id: string;
  meal_id: string;
}

export interface CalendarScheduleRequest {
  user_id: string;
  start_date: string;
  end_date: string;
}

export interface CalendarChangesRequest {
  user_id: string;
  changes: {
    date: string;
    meals: string[];
  }[];
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  username: string;
  password: string;
}
