import mongoose, { Schema, Model } from "mongoose"

export interface TestDoc extends mongoose.Document {
  teacherId: string
  title: string
  paperUrl?: string
  description?: string
  questions?: string[]
  status?: "draft" | "published"
  startAt?: Date | null
  endAt?: Date | null
  items?: any[]
  scheduleAt?: Date
  createdAt: Date
}

const TestSchema = new Schema<TestDoc>({
  teacherId: { type: String, index: true, required: true },
  title: { type: String, required: true },
  paperUrl: { type: String },
  description: { type: String },
  questions: { type: [String], default: [] },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  startAt: { type: Date, default: null },
  endAt: { type: Date, default: null },
  items: { type: Schema.Types.Mixed, default: [] },
  scheduleAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

export const TestModel: Model<TestDoc> =
  (mongoose.models.Test as Model<TestDoc>) || mongoose.model<TestDoc>("Test", TestSchema)
