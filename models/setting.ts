import mongoose, { Schema, Model } from "mongoose"

export interface SettingDoc extends mongoose.Document {
  siteName?: string
  maintenanceMode?: boolean
  updatedAt: Date
}

const SettingSchema = new Schema<SettingDoc>({
  siteName: { type: String, default: "Evalify" },
  maintenanceMode: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
})

export const SettingModel: Model<SettingDoc> =
  (mongoose.models.Setting as Model<SettingDoc>) || mongoose.model<SettingDoc>("Setting", SettingSchema)
