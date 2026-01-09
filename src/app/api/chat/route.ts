import { NextResponse } from "next/server";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { groqModel } from "@/lib/ai/groq";
import { retrieveKb } from "@/lib/ai/retrieve";
import { systemPrompt, contextBlock } from "@/lib/ai/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClientMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: ClientMsg[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content?.trim();
    if (!lastUser) {
      return NextResponse.json({ ok: false, error: "Missing user message" }, { status: 400 });
    }

    // Keep only last ~10 messages for cost + speed
    const trimmed = messages.slice(-10);

    // Retrieve KB context from MongoDB
    const kb = await retrieveKb(lastUser, 6);

    const model = groqModel();

    const lcMsgs = [
      new SystemMessage(systemPrompt()),
      new SystemMessage(contextBlock(kb)),
      ...trimmed.map((m) => (m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content))),
    ];

    const out = await model.invoke(lcMsgs);
    const reply = typeof out.content === "string" ? out.content : JSON.stringify(out.content);

    return NextResponse.json({ ok: true, reply });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
