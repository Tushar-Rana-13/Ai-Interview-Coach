
import { extractResumeText } from "../services/resume.service.js";

export const uploadResumeController = async (req, res) => {
  try {
    const result = await extractResumeText(req.file);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and text extracted successfully.",
      data: {
        fileType: result.fileType,
        characterCount: result.characterCount,
      },
    });
  } catch (error) {
    console.error("Resume extraction error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to process resume.",
    });
  }
};
