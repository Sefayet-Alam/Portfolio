"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { MOTION } from "@/lib/motion/config";
import { useGsapContext } from "@/lib/motion/useGsapContext";

export function SpatialField() {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const mm = gsap.matchMedia();
      let ambient: gsap.core.Timeline | null = null;

      const onVisibility = () => {
        if (!ambient) return;
        if (document.hidden) ambient.pause();
        else ambient.resume();
      };
      document.addEventListener("visibilitychange", onVisibility);

      mm.add(MOTION.motionOk, () => {
        ambient = gsap
          .timeline({ repeat: -1 })
          .to(
            ".spatial-orbit-primary",
            {
              rotation: 360,
              transformOrigin: "50% 50%",
              duration: 52,
              ease: "none",
            },
            0,
          )
          .to(
            ".spatial-orbit-secondary",
            {
              rotation: -360,
              transformOrigin: "50% 50%",
              duration: 38,
              ease: "none",
            },
            0,
          )
          .to(
            ".spatial-packet",
            {
              opacity: 0.9,
              scale: 1.8,
              transformOrigin: "50% 50%",
              duration: 1.4,
              stagger: 0.45,
              yoyo: true,
              repeat: 3,
              ease: "sine.inOut",
            },
            0,
          );

        gsap.to(".spatial-plane-far", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.8 },
        });
        gsap.to(".spatial-plane-mid", {
          yPercent: -16,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 1 },
        });
        gsap.to(".spatial-plane-near", {
          yPercent: -25,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 1.2 },
        });
        gsap.fromTo(
          ".spatial-signal",
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.7 },
          },
        );

        return () => {
          ambient?.kill();
          ambient = null;
        };
      });

      mm.add(MOTION.pointer, () => {
        const farX = gsap.quickTo(".spatial-plane-far", "x", {
          duration: 1.2,
          ease: MOTION.ease,
        });
        const farY = gsap.quickTo(".spatial-plane-far", "y", {
          duration: 1.2,
          ease: MOTION.ease,
        });
        const nearX = gsap.quickTo(".spatial-plane-near", "x", {
          duration: 0.8,
          ease: MOTION.ease,
        });
        const nearY = gsap.quickTo(".spatial-plane-near", "y", {
          duration: 0.8,
          ease: MOTION.ease,
        });

        const onPointerMove = (event: PointerEvent) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          farX(nx * -14);
          farY(ny * -10);
          nearX(nx * 24);
          nearY(ny * 18);
        };
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        return () => window.removeEventListener("pointermove", onPointerMove);
      });

      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        mm.revert();
      };
    },
    [],
    root,
  );

  return (
    <div ref={root} aria-hidden className="layer-stage">
      <div
        className="spatial-plane-far absolute inset-[-12%]"
        style={{
          transform: "translateZ(-520px) scale(1.52)",
          backgroundImage:
            "radial-gradient(circle at center, var(--plane-1) 1px, transparent 1.4px)",
          backgroundSize: "42px 42px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 88%)",
        }}
      />

      <svg
        className="spatial-plane-mid absolute inset-[-8%] h-[116%] w-[116%]"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: "translateZ(-260px) scale(1.25)" }}
      >
        <g opacity="0.7">
          <path className="spatial-path" d="M70 190L280 90L470 225L675 125L890 250L1130 105" />
          <path className="spatial-path" d="M35 610L250 485L470 610L705 455L930 590L1190 430" />
          <path className="spatial-path" d="M280 90L250 485M470 225L470 610M675 125L705 455M890 250L930 590" />
        </g>
        <path
          pathLength="1"
          className="spatial-signal"
          d="M-20 760C180 650 180 455 350 430C520 405 525 230 715 250C900 270 970 100 1220 75"
        />
        <path
          pathLength="1"
          className="spatial-signal opacity-40"
          d="M-40 155C155 230 260 315 430 290C635 258 735 690 930 675C1070 665 1140 535 1240 590"
        />
        {[
          [70, 190],
          [280, 90],
          [470, 225],
          [675, 125],
          [890, 250],
          [1130, 105],
          [250, 485],
          [470, 610],
          [705, 455],
          [930, 590],
        ].map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            className="spatial-node"
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 5 : 3}
            opacity={index % 2 === 0 ? 0.78 : 0.44}
          />
        ))}
        {[
          [350, 430],
          [715, 250],
          [930, 675],
        ].map(([cx, cy]) => (
          <g key={`packet-${cx}-${cy}`}>
            <circle
              className="spatial-packet"
              cx={cx}
              cy={cy}
              r="8"
              fill="var(--signal-soft)"
              stroke="var(--signal)"
              strokeWidth="1"
              opacity="0.25"
            />
            <circle cx={cx} cy={cy} r="2.4" fill="var(--signal)" />
          </g>
        ))}
      </svg>

      <div
        className="spatial-plane-near absolute inset-[-12%]"
        style={{
          transform: "translateZ(-90px) scale(1.08)",
          background:
            "radial-gradient(38% 30% at 78% 18%, var(--plane-2), transparent 72%), radial-gradient(34% 28% at 15% 76%, var(--plane-3), transparent 72%)",
        }}
      >
        <div className="spatial-orbit-primary absolute right-[9%] top-[13%] h-72 w-72 rounded-full border border-rule opacity-40">
          <span className="absolute -left-1 top-1/2 h-2 w-2 rounded-full bg-accent" />
          <span className="absolute -right-1 top-1/3 h-2 w-2 rounded-full bg-signal" />
        </div>
        <div className="spatial-orbit-secondary absolute bottom-[16%] left-[6%] h-44 w-44 rounded-full border border-rule opacity-30">
          <span className="absolute left-1/2 top-[-4px] h-2 w-2 rounded-full bg-signal" />
          <span className="absolute bottom-[12%] right-[6%] h-1.5 w-1.5 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
