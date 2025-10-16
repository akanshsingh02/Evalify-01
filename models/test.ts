import mongoose, { Schema, Model } from "mongoose"

export interface TestDoc extends mongoose.Document {
  title: string
  description?: string
  questions: string[]
  items?: Array<{
    id: string
    type: "mcq" | "short" | "descriptive"
    prompt: string
    options?: string[]
    answer?: string | string[]
    maxPoints: number
  }>
  teacherId: string
  status: "draft" | "published"
  startAt?: Date | null
  endAt?: Date | null
  createdAt: Date
}

const TestSchema = new Schema<TestDoc>({
  title: { type: String, required: true },
  description: { type: String },
  questions: { type: [String], default: [] },
  items: { type: [Object], default: [] },
  teacherId: { type: String, required: true, index: true },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  startAt: { type: Date, default: null },
  endAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
})

export const TestModel: Model<TestDoc> =
  (mongoose.models.Test as Model<TestDoc>) || mongoose.model<TestDoc>("Test", TestSchema)
