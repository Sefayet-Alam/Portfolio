import { ChatGroq } from "@langchain/groq";

function must(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function groqModel() {
  const apiKey = must("GROQ_API_KEY");
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  return new ChatGroq({
    apiKey,
    model,
    temperature: 0.2,
  });
}
