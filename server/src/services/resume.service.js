import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";
import path from "path";

export const extractResumeText = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("Resume file is missing.");
  }

  const extension = path.extname(file.originalname).toLowerCase();

  let extractedText = "";

  if (extension === ".pdf") {
    const pdfData = await pdfParse(file.buffer);
    extractedText = pdfData.text;
  } else if (extension === ".docx") {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    extractedText = result.value;
  } else {
    throw new Error("Unsupported resume file format.");
  }

  // Normalize extracted text
  extractedText = extractedText
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!extractedText) {
    throw new Error(
      "Could not extract text. The resume may be empty or image-based."
    );
  }

  return {
    text: extractedText,
    fileType: extension.replace(".", ""),
    originalFileName: file.originalname,
    characterCount: extractedText.length,
  };
};
