import { NextResponse } from "next/server";
import { generateImage, generateVideo } from "@/lib/media/higgsfield";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/media
//   { "type": "image", "prompt": "..." }
//   { "type": "video", "prompt": "...", "imageUrl": "https://..." }
// Returns { ok: true, urls: string[] } | { ok: true, url: string }.
//
// NOTE: generation is slow (~45s) and paid. Guard this route (auth/rate-limit)
// before exposing it publicly — right now it will spend credits for any caller.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      type?: "image" | "video";
      prompt?: string;
      imageUrl?: string;
    };

    const prompt = body.prompt?.trim();
    if (!prompt) {
      return NextResponse.json(
        { ok: false, error: "Missing 'prompt'." },
        { status: 400 },
      );
    }

    if (body.type === "video") {
      if (!body.imageUrl) {
        return NextResponse.json(
          { ok: false, error: "'video' requires 'imageUrl'." },
          { status: 400 },
        );
      }
      const url = await generateVideo({ prompt, imageUrl: body.imageUrl });
      return NextResponse.json({ ok: true, url });
    }

    // default: image
    const urls = await generateImage({ prompt });
    return NextResponse.json({ ok: true, urls });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Generation failed." },
      { status: 500 },
    );
  }
}
