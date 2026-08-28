import assert from "node:assert/strict";
import test from "node:test";

import { resolveGroqModel } from "./groq.ts";

test("uses the current default when GROQ_MODEL is not configured", () => {
  assert.equal(resolveGroqModel(undefined), "openai/gpt-oss-20b");
});

test("migrates Groq's retired Llama model IDs", () => {
  assert.equal(
    resolveGroqModel("llama-3.1-8b-instant"),
    "openai/gpt-oss-20b",
  );
  assert.equal(
    resolveGroqModel("llama-3.3-70b-versatile"),
    "openai/gpt-oss-120b",
  );
});

test("preserves a valid custom Groq model", () => {
  assert.equal(resolveGroqModel("qwen/qwen3.6-27b"), "qwen/qwen3.6-27b");
});
