import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICalendarUser {
  user_id: mongoose.Types.ObjectId | string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snack?: string;
}

export interface ICalendar extends Document {
  _id: mongoose.Types.ObjectId;
  date: string;
  users: ICalendarUser[];
  createdAt: Date;
  updatedAt: Date;
}

const CalendarUserSchema = new Schema<ICalendarUser>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    breakfast: { type: String, required: false },
    lunch: { type: String, required: false },
    dinner: { type: String, required: false },
    snack: { type: String, required: false },
  },
  { _id: false }
);

const CalendarSchema = new Schema<ICalendar>(
  {
    date: { type: String, required: true },
    users: { type: [CalendarUserSchema], required: false, default: [] },
  },
  { timestamps: true }
);

// Prevent model recompilation in development
const Calendar: Model<ICalendar> =
  mongoose.models.Calendar || mongoose.model<ICalendar>("Calendar", CalendarSchema);

export default Calendar;
