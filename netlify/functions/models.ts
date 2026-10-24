import { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";
import OpenAI from "openai";
import {
  TRANSCRIPTION_MODELS,
  type TranscriptionModelMetadata,
} from "./shared/transcriptionModels";

// OpenAI's /v1/models endpoint only returns { id, object, created, owned_by } -
// no pricing, description, or "recommended" info - so we still need our own
// metadata for those. This asks OpenAI which of our candidate transcription
// models this API key's account actually has access to right now, instead of
// just assuming our whole candidate list is available.
const fetchAvailableModels = async (
  apiKey: string
): Promise<TranscriptionModelMetadata[]> => {
  const openai = new OpenAI({ apiKey });
  const { data } = await openai.models.list();
  const availableIds = new Set(data.map((model) => model.id));
  const availableModels = TRANSCRIPTION_MODELS.filter((model) =>
    availableIds.has(model.id)
  );
  return availableModels.length > 0 ? availableModels : TRANSCRIPTION_MODELS;
};

export const handler: Handler = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: "",
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  const apiKey = authHeader?.replace(/^Bearer\s+/i, "").trim();

  let models = TRANSCRIPTION_MODELS;
  if (apiKey) {
    try {
      models = await fetchAvailableModels(apiKey);
    } catch (error) {
      // Fall back to the full candidate list (e.g. invalid key, network error)
      console.error("Failed to fetch models from OpenAI:", error);
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ models }),
  };
};
