import mongoose, { Schema, Model } from "mongoose"

export interface TopicStat {
  topic: string
  score: number
  maxScore: number
  correctCount?: number
  totalCount?: number
}

export interface PerformanceDoc extends mongoose.Document {
  studentId: string
  testId: string
  submissionId: string
  score: number
  maxScore: number
  createdAt: Date
  topics?: TopicStat[]
}

const TopicSchema = new Schema<TopicStat>({
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  correctCount: { type: Number },
  totalCount: { type: Number },
}, { _id: false })

const PerformanceSchema = new Schema<PerformanceDoc>({
  studentId: { type: String, index: true, required: true },
  testId: { type: String, index: true, required: true },
  submissionId: { type: String, index: true, required: true, unique: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  topics: { type: [TopicSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
})

export const PerformanceModel: Model<PerformanceDoc> =
  (mongoose.models.Performance as Model<PerformanceDoc>) || mongoose.model<PerformanceDoc>("Performance", PerformanceSchema)
