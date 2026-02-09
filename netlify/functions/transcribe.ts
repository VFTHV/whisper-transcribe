import { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";
import OpenAI from "openai";

export const handler: Handler = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const contentType = event.headers["content-type"] || "";

    if (!contentType.includes("multipart/form-data")) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Content-Type must be multipart/form-data",
        }),
      };
    }

    // Get the boundary from content-type
    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "No boundary found in multipart data" }),
      };
    }

    // Parse the request body
    const bodyBuffer = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : Buffer.from(event.body || "", "utf8");

    // Simple multipart parser
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    const parts: Buffer[] = [];
    let start = 0;

    while (true) {
      const boundaryIndex = bodyBuffer.indexOf(boundaryBuffer, start);
      if (boundaryIndex === -1) break;

      if (start !== 0) {
        parts.push(bodyBuffer.slice(start, boundaryIndex));
      }
      start = boundaryIndex + boundaryBuffer.length;
    }

    let audioBuffer: Buffer | null = null;
    let apiKey = "";
    let model = "";

    // Parse each part
    for (const part of parts) {
      const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
      if (headerEnd === -1) continue;

      const headers = part.slice(0, headerEnd).toString();
      const content = part.slice(headerEnd + 4);

      if (headers.includes('name="apiKey"')) {
        apiKey = content.toString().trim().replace(/\r\n$/, "");
      } else if (headers.includes('name="model"')) {
        model = content.toString().trim().replace(/\r\n$/, "");
      } else if (headers.includes('name="audio"')) {
        // Remove trailing CRLF if present
        const contentStr = content.toString("binary");
        const cleanContent = contentStr.replace(/\r\n$/, "");
        audioBuffer = Buffer.from(cleanContent, "binary");
      }
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "No audio file provided" }),
      };
    }

    if (!apiKey) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "OpenAI API key is required" }),
      };
    }

    // Initialize OpenAI with user's API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log(
      "Processing audio file in Netlify function, size:",
      audioBuffer.length
    );

    // Create a File object for OpenAI API
    const audioFile = new File(
      [new Uint8Array(audioBuffer)],
      "recording.webm",
      {
        type: "audio/webm",
      }
    );

    const allowedModels = [
      "whisper-1",
      "gpt-4o-transcribe",
      "gpt-4o-mini-transcribe",
      "gpt-4o-transcribe-diarize",
    ];
    const transcriptionModel =
      model && allowedModels.includes(model) ? model : "whisper-1";

    // Send to OpenAI Whisper API (diarize model does not support prompt)
    const createOptions = {
      file: audioFile,
      model: transcriptionModel,
      response_format: "json" as const,
      ...(transcriptionModel !== "gpt-4o-transcribe-diarize" && {
        prompt:
          "This transcription is about React code with TypeScript, JavaScript, sometimes using reselect library, async selector kit library, and also having Express server. The content includes code snippets, function names, variable names, and programming terminology.",
      }),
    };
    const transcription = await openai.audio.transcriptions.create(
      createOptions
    );

    console.log("Transcription completed:", transcription.text);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        transcription: transcription.text,
      }),
    };
  } catch (error) {
    console.error("Transcription error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to transcribe audio",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
