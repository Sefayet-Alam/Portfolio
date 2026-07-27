# Higgsfield AI — media generation

AI **image + video** asset generation, wired into this Next.js app via the
official `@higgsfield/client` SDK (v2 API). Use it to generate cinematic hero
images, textures, and short motion clips — flat media assets, not interactive 3D.

> Higgsfield produces **images and video**. For interactive in-browser 3D
> (rotatable models, real depth) use React Three Fiber. A good pairing:
> Higgsfield for the backdrop/asset, R3F for the live 3D layer.

## Setup

1. Get a key at <https://cloud.higgsfield.ai/> (format `KEY_ID:KEY_SECRET`).
2. Put it in `.env.local`:
   ```
   HIGGSFIELD_CREDENTIALS=KEY_ID:KEY_SECRET
   ```
   Server-only — no `NEXT_PUBLIC_` prefix, so it never reaches the browser.

## Files

| Path | Purpose |
| --- | --- |
| `src/lib/media/higgsfield.ts` | Server-only helper: `generateImage()`, `generateVideo()`. |
| `src/app/api/media/route.ts` | `POST /api/media` endpoint wrapping the helper. |

## Use from server code (recommended)

```ts
import { generateImage, generateVideo } from "@/lib/media/higgsfield";

// text -> image
const [imgUrl] = await generateImage({
  prompt: "cinematic 3D abstract hero, volumetric light, dark tech",
});

// image -> video (motion)
const videoUrl = await generateVideo({
  prompt: "slow cinematic zoom, subtle parallax",
  imageUrl: imgUrl,
});
```

## Use via the API route

```bash
# image
curl -X POST http://localhost:3000/api/media \
  -H 'content-type: application/json' \
  -d '{"type":"image","prompt":"cinematic 3D abstract hero"}'
# -> { "ok": true, "urls": ["https://..."] }

# video (needs a source image URL)
curl -X POST http://localhost:3000/api/media \
  -H 'content-type: application/json' \
  -d '{"type":"video","prompt":"slow cinematic zoom","imageUrl":"https://..."}'
# -> { "ok": true, "url": "https://..." }
```

## Notes

- **Async + slow:** each generation takes ~45s; the helper blocks until done
  (`withPolling`). Don't call it in a hot request path — pre-generate assets, or
  run it from a background job / build step and cache the result URLs.
- **Paid:** every call spends Higgsfield credits. The `/api/media` route is
  currently **unauthenticated** — add auth/rate-limiting (like `api/admin`) before
  shipping it, or only call the helper from trusted server code.
- **Result URLs** are hosted by Higgsfield. To serve them yourself, download and
  store the asset (e.g. in `public/` or object storage) rather than hotlinking.
- Endpoints used: `flux-pro/kontext/max/text-to-image` (image),
  `/v1/image2video/dop` (video). Swap the `endpoint`/`model` args for other models.
