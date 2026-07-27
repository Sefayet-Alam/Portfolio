export function Chip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center border border-rule px-3 py-1.5 font-mono text-sm leading-snug text-ink">
      {text}
    </span>
  );
}
