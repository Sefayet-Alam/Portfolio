// components/ui/chip.tsx
export function Chip({ text }: { text: string }) {
  return (
    <span
      className="
        inline-flex items-center
        rounded-full border border-zinc-200 bg-white
        px-3 py-1.5
        text-sm leading-snug text-zinc-700
        md:px-4 md:py-2 md:text-base
        dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200
      "
    >
      {text}
    </span>
  );
}
