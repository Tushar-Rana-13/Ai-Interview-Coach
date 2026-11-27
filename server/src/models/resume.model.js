import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "docx"],
      required: true,
    },

    parsedData: {
      summary: String,

      skills: [String],

      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
          achievements: [String],
        },
      ],

      experience: [
        {
          company: String,
          role: String,
          duration: String,
          responsibilities: [String],
        },
      ],

      education: [
        {
          institution: String,
          degree: String,
          fieldOfStudy: String,
          graduationYear: Number,
        },
      ],

      certifications: [String],
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

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;