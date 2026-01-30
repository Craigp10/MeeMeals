import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRole extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true },
});

// Prevent model recompilation in development
const Role: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);

export default Role;
