import mongoose, { Schema, Model } from "mongoose"

export interface TestDoc extends mongoose.Document {
  teacherId: string
  title: string
  paperUrl?: string
  scheduleAt?: Date
  createdAt: Date
}

const TestSchema = new Schema<TestDoc>({
  teacherId: { type: String, index: true, required: true },
  title: { type: String, required: true },
  paperUrl: { type: String },
  scheduleAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

export const TestModel: Model<TestDoc> =
  (mongoose.models.Test as Model<TestDoc>) || mongoose.model<TestDoc>("Test", TestSchema)
