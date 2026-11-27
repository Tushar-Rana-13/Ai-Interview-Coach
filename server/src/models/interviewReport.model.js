
import mongoose from "mongoose";

const answerHighlightSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    suggestedImprovement: {
      type: String,
    },
  },
  { _id: false }
);

const roadmapItemSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    action: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      unique: true,
    },

    scores: {
      overall: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
      },
      technical: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
      },
      communication: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
      },
    },

    summary: {
      type: String,
      required: true,
    },

    strengths: [String],

    weaknesses: [String],

    topicsToRevise: [String],

    bestAnswer: {
      type: answerHighlightSchema,
      default: undefined,
    },

    weakestAnswer: {
      type: answerHighlightSchema,
      default: undefined,
    },

    improvementRoadmap: [roadmapItemSchema],
  },
  { timestamps: true }
);

const InterviewReport = mongoose.model(
  "InterviewReport",
  interviewReportSchema
);

export default InterviewReport;
