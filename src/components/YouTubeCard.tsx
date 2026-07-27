"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

function getYouTubeId(url: string) {
    try {
        const u = new URL(url);

        // youtu.be/<id>
        if (u.hostname.includes("youtu.be")) {
            const id = u.pathname.replace("/", "");
            return id || null;
        }

        // youtube.com/watch?v=<id>
        const v = u.searchParams.get("v");
        if (v) return v;

        // youtube.com/shorts/<id>
        const shortsMatch = u.pathname.match(/\/shorts\/([^/]+)/);
        if (shortsMatch?.[1]) return shortsMatch[1];

        // youtube.com/embed/<id>
        const embedMatch = u.pathname.match(/\/embed\/([^/]+)/);
        if (embedMatch?.[1]) return embedMatch[1];

        return null;
    } catch {
        return null;
    }
}

export default function YouTubeCard({
    url,
    title,
}: {
    url: string;
    title: string;
}) {
    const [play, setPlay] = useState(false);

    const videoId = useMemo(() => getYouTubeId(url), [url]);

    // Strict check: YouTube video ids are typically 11 chars.
    // Shorts also use 11. This prevents 404 thumbnail spam.
    const isLikelyValidId = !!videoId && videoId.length === 11;

    if (!isLikelyValidId) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface px-4 text-center text-sm text-muted">
                <div className="font-mono uppercase tracking-wider text-ink">Invalid YouTube link</div>
                <div className="text-xs opacity-80">
                    Please use a full YouTube URL (video id is usually 11 characters).
                </div>
            </div>
        );
    }

    const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;

    return (
        <div className="relative h-full w-full">
            {!play ? (
                <button
                    type="button"
                    onClick={() => setPlay(true)}
                    className="group relative h-full w-full"
                    aria-label={`Play ${title}`}
                >
                    <Image
                        src={thumb}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />

                    <div className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/30">
                        <div className="bg-accent p-4 text-accent-ink transition-transform group-hover:scale-105">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </button>
            ) : (
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={embedSrc}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            )}
        </div>
    );
}
