
import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    technicalAccuracy: {
      type: Number,
      min: 0,
      max: 10,
    },

    completeness: {
      type: Number,
      min: 0,
      max: 10,
    },

    clarity: {
      type: Number,
      min: 0,
      max: 10,
    },

    feedback: {
      type: String,
    },

    strengths: [String],

    improvements: [String],
  },
  { _id: false }
);

const followUpSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    evaluation: {
      type: evaluationSchema,
      default: undefined,
    },
  },
  { timestamps: true }
);

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    answer: {
      type: String,
      default: "",
    },

    evaluation: {
      type: evaluationSchema,
      default: undefined,
    },

    followUps: [followUpSchema],
  },
  { timestamps: true }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    jobDescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobDescription",
      default: null,
    },

    interviewType: {
      type: String,
      enum: ["technical", "behavioral", "mixed"],
      default: "mixed",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    duration: {
      type: Number,
      min: 1,
      default: 30,
    },

    questions: [interviewQuestionSchema],

    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled"],
      default: "scheduled",
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
