
import mongoose from "mongoose";

const jobDescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    extractedData: {
      requiredSkills: [String],

      preferredSkills: [String],

      responsibilities: [String],

      experienceLevel: {
        type: String,
        enum: [
          "internship",
          "entry-level",
          "mid-level",
          "senior",
          "lead",
          "unknown",
        ],
        default: "unknown",
      },

      minimumExperience: {
        type: Number,
        min: 0,
      },
    },

    analysisStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const JobDescription = mongoose.model(
  "JobDescription",
  jobDescriptionSchema
);

export default JobDescription;
