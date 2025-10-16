import mongoose, { Schema, Model } from "mongoose"

export interface TestDoc extends mongoose.Document {
  title: string
  description?: string
  questions: string[]
  teacherId: string
  status: "draft" | "published"
  createdAt: Date
}

const TestSchema = new Schema<TestDoc>({
  title: { type: String, required: true },
  description: { type: String },
  questions: { type: [String], default: [] },
  teacherId: { type: String, required: true, index: true },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
})

export const TestModel: Model<TestDoc> =
  (mongoose.models.Test as Model<TestDoc>) || mongoose.model<TestDoc>("Test", TestSchema)
