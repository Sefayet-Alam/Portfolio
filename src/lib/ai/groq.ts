import { ChatGroq } from "@langchain/groq";

const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

const RETIRED_GROQ_MODELS: Readonly<Record<string, string>> = {
  "llama-3.1-8b-instant": "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile": "openai/gpt-oss-120b",
};

function must(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function resolveGroqModel(configuredModel?: string) {
  const model = configuredModel?.trim() || DEFAULT_GROQ_MODEL;
  return RETIRED_GROQ_MODELS[model] || model;
}

export function groqModel() {
  const apiKey = must("GROQ_API_KEY");
  const model = resolveGroqModel(process.env.GROQ_MODEL);

  return new ChatGroq({
    apiKey,
    model,
    temperature: 0.2,
  });
}
