/**
 * Splits an element's text into per-line wrappers so each line can be
 * revealed independently. Hand-rolled to avoid a SplitText dependency.
 *
 * Each line becomes:  <span class="line"><span class="line-inner">…</span></span>
 * `.line` has overflow:hidden so `.line-inner` can slide up from behind it.
 *
 * Returns the `.line-inner` elements, which are what you animate.
 */
export function splitLines(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  // Measure by laying out one span per word and grouping by offsetTop.
  el.textContent = "";
  const probes = words.map((w) => {
    const s = document.createElement("span");
    s.textContent = w;
    s.style.display = "inline-block";
    el.appendChild(s);
    el.appendChild(document.createTextNode(" "));
    return s;
  });

  const rows = new Map<number, string[]>();
  probes.forEach((p, i) => {
    const top = Math.round(p.offsetTop);
    if (!rows.has(top)) rows.set(top, []);
    rows.get(top)!.push(words[i]);
  });

  el.textContent = "";
  const inners: HTMLElement[] = [];

  for (const lineWords of rows.values()) {
    const line = document.createElement("span");
    line.className = "line";
    line.style.display = "block";
    line.style.overflow = "hidden";
    // Descenders (g, y, p) clip against overflow:hidden without padding.
    line.style.paddingBottom = "0.12em";
    line.style.marginBottom = "-0.12em";

    const inner = document.createElement("span");
    inner.className = "line-inner";
    inner.style.display = "block";
    inner.textContent = lineWords.join(" ");

    line.appendChild(inner);
    el.appendChild(line);
    inners.push(inner);
  }

  return inners;
}
