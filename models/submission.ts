import mongoose, { Schema, Model } from "mongoose"

export interface SubmissionDoc extends mongoose.Document {
  studentId: string
  testId?: string
  assignmentId?: string
  answers?: any
  score?: number
  overriddenScore?: number
  results?: any[]
  totalScore?: number
  maxScore?: number
  autoGraded?: boolean
  attachments?: string[]
  status: "Pending" | "Evaluated" | "Re-evaluated"
  createdAt: Date
}

const SubmissionSchema = new Schema<SubmissionDoc>({
  studentId: { type: String, index: true, required: true },
  testId: { type: String },
  assignmentId: { type: String },
  answers: { type: Schema.Types.Mixed },
  score: { type: Number },
  overriddenScore: { type: Number },
  results: { type: [Schema.Types.Mixed], default: [] },
  totalScore: { type: Number },
  maxScore: { type: Number },
  autoGraded: { type: Boolean, default: false },
  attachments: { type: [String], default: [] },
  status: { type: String, enum: ["Pending", "Evaluated", "Re-evaluated"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
})

export const SubmissionModel: Model<SubmissionDoc> =
  (mongoose.models.Submission as Model<SubmissionDoc>) || mongoose.model<SubmissionDoc>("Submission", SubmissionSchema)
