import mongoose, { Schema, Model } from "mongoose"
import type { AppUserRole } from "@/lib/utils"

export interface UserDoc extends mongoose.Document {
  name?: string
  email: string
  password?: string
  role: AppUserRole
}

const UserSchema = new Schema<UserDoc>({
  name: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student", required: true },
}, { timestamps: true })

export const UserModel: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) || mongoose.model<UserDoc>("User", UserSchema)


