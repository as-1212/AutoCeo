import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

const hasGroq = Boolean(process.env.GROQ_API_KEY);
const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

const model = hasGroq
  ? new ChatOpenAI({
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.2,
      configuration: {
        baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
      }
    })
  : hasOpenAI
    ? new ChatOpenAI({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.2 })
    : null;

export async function reasonWithLLM(systemPrompt, userPrompt) {
  if (!model) {
    return {
      text: `LLM key missing (set GROQ_API_KEY). Fallback reasoning used for: ${userPrompt.slice(0, 180)}`,
      source: "fallback"
    };
  }

  const result = await model.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ]);

  return { text: result.content?.toString() || "", source: hasGroq ? "groq" : "openai" };
}
