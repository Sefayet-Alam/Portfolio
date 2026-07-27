"use client";

import { useEffect, useMemo, useState } from "react";

export function IntroLoader() {
  const greetings = useMemo(
    () => [
      "Hello",
      "Ciao",
      "Hola",
      "Bonjour",
      "Salam",
      "こんにちは",
      "안녕하세요",
      "Namaste",
      "Merhaba",
    ],
    [],
  );

  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    // show only once per tab/session
    const seen = sessionStorage.getItem("introSeen");
    if (seen === "1") return;

    sessionStorage.setItem("introSeen", "1");
    // sessionStorage is unavailable during SSR, so this gate can only be
    // evaluated on the client. Reading it in a state initializer instead
    // would desync server and client markup and break hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("intro-active");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const doneTimer = window.setTimeout(() => {
        setShow(false);
        document.body.style.overflow = prevOverflow;
        document.documentElement.classList.remove("intro-active");
        window.dispatchEvent(new CustomEvent("intro-complete"));
      }, 280);
      return () => {
        clearTimeout(doneTimer);
        document.body.style.overflow = prevOverflow;
        document.documentElement.classList.remove("intro-active");
      };
    }

    const cycle = window.setInterval(() => {
      setIndex((i) => (i + 1) % greetings.length);
      setProgress((value) => Math.min(92, value + 13));
    }, 210);

    const completeTimer = window.setTimeout(() => setProgress(100), 1480);
    const leaveTimer = window.setTimeout(() => setLeaving(true), 1640);
    const doneTimer = window.setTimeout(() => {
      setShow(false);
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove("intro-active");
      window.dispatchEvent(new CustomEvent("intro-complete"));
    }, 1940);

    return () => {
      clearInterval(cycle);
      clearTimeout(completeTimer);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove("intro-active");
    };
  }, [greetings.length]);

  if (!show) return null;

  const status =
    progress < 38
      ? "Context online"
      : progress < 76
        ? "Research indexed"
        : progress < 100
          ? "Systems ready"
          : "Signal acquired";

  return (
    <div className={`intro-overlay ${leaving ? "intro-leave" : ""}`}>
      <div className="intro-network" aria-hidden>
        <span className="intro-node intro-node-a" />
        <span className="intro-node intro-node-b" />
        <span className="intro-node intro-node-c" />
        <span className="intro-node intro-node-d" />
        <svg viewBox="0 0 900 520" preserveAspectRatio="none">
          <path d="M40 375C205 210 300 340 430 190C570 30 680 185 860 75" />
          <path d="M-20 135C190 250 300 75 505 270C650 405 760 330 930 455" />
        </svg>
      </div>

      <div className="intro-console">
        <div className="intro-console-top">
          <span>SA / neural handshake</span>
          <span>{String(progress).padStart(3, "0")}%</span>
        </div>

        <div className="intro-copy">
          <p className="intro-hello" aria-live="polite">
            {greetings[index]}
          </p>
          <p className="intro-sub">{status}</p>
        </div>

        <div className="intro-progress" aria-hidden>
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>

        <div className="intro-console-bottom">
          <span>NLP</span>
          <span>Agentic systems</span>
          <span>Problem solving</span>
        </div>
      </div>
    </div>
  );
}
