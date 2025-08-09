import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `audio-${uniqueSuffix}.webm`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
});

// OpenAI will be initialized per request with user's API key

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Whisper Transcribe API is running" });
});

// Transcribe audio endpoint
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    // Get API key from request body
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: "OpenAI API key is required" });
    }

    // Initialize OpenAI with user's API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log("Processing audio file:", req.file.filename);

    // Create file stream for OpenAI
    const audioFile = fs.createReadStream(req.file.path);

    // Send to OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "json",
      prompt:
        "This transcription is about React code with TypeScript, JavaScript, sometimes using reselect library, async selector kit library, and also having Express server. The content includes code snippets, function names, variable names, and programming terminology.",
    });

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    console.log("Transcription completed:", transcription.text);

    res.json({
      success: true,
      transcription: transcription.text,
      language: transcription.language,
    });
  } catch (error) {
    console.error("Transcription error:", error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Failed to transcribe audio",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
