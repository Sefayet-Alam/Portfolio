"use client";

import { useEffect, useMemo, useState } from "react";

export function IntroLoader() {
  const greetings = useMemo(
    () => ["Hello", "Ciao", "Hola", "Bonjour", "Salam", "こんにちは", "안녕하세요", "Namaste", "Merhaba"],
    []
  );

  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // show only once per tab/session
    const seen = sessionStorage.getItem("introSeen");
    if (seen === "1") return;

    sessionStorage.setItem("introSeen", "1");
    setShow(true);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const cycle = window.setInterval(() => {
      setIndex((i) => (i + 1) % greetings.length);
    }, 220);

    const leaveTimer = window.setTimeout(() => setLeaving(true), 1500);
    const doneTimer = window.setTimeout(() => {
      setShow(false);
      document.body.style.overflow = prevOverflow;
    }, 1850);

    return () => {
      clearInterval(cycle);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [greetings.length]);

  if (!show) return null;

  return (
    <div className={`intro-overlay ${leaving ? "intro-leave" : ""}`}>
      <div className="intro-card">
        <div className="intro-glow" />
        <p className="intro-hello">{greetings[index]}</p>
        <p className="intro-sub">Welcome</p>
      </div>
    </div>
  );
}
