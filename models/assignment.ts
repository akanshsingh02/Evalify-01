import mongoose, { Schema, Model } from "mongoose"

export interface AssignmentDoc extends mongoose.Document {
  studentId: string
  title: string
  fileUrl?: string
  createdAt: Date
}

const AssignmentSchema = new Schema<AssignmentDoc>({
  studentId: { type: String, index: true, required: true },
  title: { type: String, required: true },
  fileUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export const AssignmentModel: Model<AssignmentDoc> =
  (mongoose.models.Assignment as Model<AssignmentDoc>) ||
  mongoose.model<AssignmentDoc>("Assignment", AssignmentSchema)


