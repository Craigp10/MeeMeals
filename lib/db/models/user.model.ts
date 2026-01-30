import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMeal {
  _id?: mongoose.Types.ObjectId;
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

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  date_created: string;
  meals: IMeal[];
  is_demo: boolean;
  roles?: mongoose.Types.ObjectId[];
}

const MealSchema = new Schema<IMeal>({
  isActive: { type: Boolean, required: true },
  display_name: { type: String, required: true },
  ingredients: { type: [String], required: false, default: [] },
  instructions: { type: [String], required: false, default: [] },
  tags: { type: [String], required: false, default: [] },
  category: { type: String, required: true },
  description: { type: String, required: false, default: "" },
  date_last_eaten: { type: String, required: false },
  date_created: { type: String, required: true },
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date_created: { type: String, required: true },
  meals: { type: [MealSchema], default: [] },
  is_demo: { type: Boolean, required: true, default: false },
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
});

// Prevent model recompilation in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
