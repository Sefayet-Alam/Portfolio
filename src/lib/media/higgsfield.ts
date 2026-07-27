// Higgsfield AI media generation — SERVER ONLY.
// Credentials live in HIGGSFIELD_CREDENTIALS (KEY_ID:KEY_SECRET) and must never
// reach the client, so this module must only be imported from server code
// (route handlers, server actions, RSC). Never import it into a "use client" file.
//
// Docs: see HIGGSFIELD.md at the repo root. SDK: @higgsfield/client (v2 API).

import { config, higgsfield } from "@higgsfield/client/v2";

// Fail loudly if this ever gets bundled for the browser.
if (typeof window !== "undefined") {
  throw new Error("lib/media/higgsfield.ts is server-only and must not run in the browser.");
}

let configured = false;

/** Configure the SDK once, lazily, from env. Throws if credentials are missing. */
function ensureConfigured() {
  if (configured) return;
  const credentials = process.env.HIGGSFIELD_CREDENTIALS;
  if (!credentials || !credentials.includes(":")) {
    throw new Error(
      "HIGGSFIELD_CREDENTIALS is not set (expected 'KEY_ID:KEY_SECRET'). " +
        "Add it to .env.local — get keys at https://cloud.higgsfield.ai/.",
    );
  }
  config({ credentials });
  configured = true;
}

export type GenerateImageOptions = {
  prompt: string;
  /** Text-to-image endpoint. Defaults to Flux Pro Kontext Max. */
  endpoint?: string;
};

export type GenerateVideoOptions = {
  prompt: string;
  /** Source still image the motion is applied to. */
  imageUrl: string;
  /** dop model variant. Defaults to the fast turbo model. */
  model?: "dop-turbo" | "dop-lite" | "dop";
};

/**
 * Text -> image. Returns the URL(s) of the generated image(s).
 * Blocks until the job completes (withPolling), then reads V2Response.images.
 */
export async function generateImage(
  opts: GenerateImageOptions,
): Promise<string[]> {
  ensureConfigured();
  const endpoint = opts.endpoint ?? "flux-pro/kontext/max/text-to-image";

  const res = await higgsfield.subscribe(endpoint, {
    input: { prompt: opts.prompt },
    withPolling: true,
  });

  assertCompleted(res.status, "image");
  const urls = (res.images ?? []).map((i) => i.url).filter(Boolean);
  if (urls.length === 0) throw new Error("Higgsfield returned no image URL.");
  return urls;
}

/**
 * Image -> video (camera/motion). Returns the generated video URL.
 * Blocks until the job completes, then reads V2Response.video.
 */
export async function generateVideo(
  opts: GenerateVideoOptions,
): Promise<string> {
  ensureConfigured();

  const res = await higgsfield.subscribe("/v1/image2video/dop", {
    input: {
      model: opts.model ?? "dop-turbo",
      prompt: opts.prompt,
      input_images: [{ type: "image_url", image_url: opts.imageUrl }],
    },
    withPolling: true,
  });

  assertCompleted(res.status, "video");
  const url = res.video?.url;
  if (!url) throw new Error("Higgsfield returned no video URL.");
  return url;
}

function assertCompleted(status: string, kind: string) {
  if (status === "completed") return;
  if (status === "nsfw") throw new Error(`Higgsfield ${kind} flagged as NSFW.`);
  throw new Error(`Higgsfield ${kind} generation ${status || "failed"}.`);
}
