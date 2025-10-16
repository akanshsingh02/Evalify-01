import mongoose, { Schema, Model } from "mongoose"

export interface SubmissionDoc extends mongoose.Document {
  testId: string
  studentId: string
  answers: string[]
  score?: number
  overriddenScore?: number | null
  autoGraded: boolean
  createdAt: Date
}

const SubmissionSchema = new Schema<SubmissionDoc>({
  testId: { type: String, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  answers: { type: [String], default: [] },
  score: { type: Number },
  overriddenScore: { type: Number, default: null },
  autoGraded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export const SubmissionModel: Model<SubmissionDoc> =
  (mongoose.models.Submission as Model<SubmissionDoc>) || mongoose.model<SubmissionDoc>("Submission", SubmissionSchema)
