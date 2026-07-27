"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  MessageCircle,
  MoveUp,
} from "lucide-react";
import type { FunInputDetail } from "@/components/fun/village";

function dispatchInput(code: string, pressed: boolean) {
  window.dispatchEvent(
    new CustomEvent<FunInputDetail>("fun-game-input", {
      detail: { code, pressed },
    }),
  );
}

function ControlButton({
  code,
  label,
  children,
  accent = false,
}: {
  code: string;
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  const release = () => dispatchInput(code, false);

  return (
    <button
      type="button"
      aria-label={label}
      className={`fun-control-button ${
        accent ? "fun-control-accent" : ""
      }`}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        dispatchInput(code, true);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      {children}
    </button>
  );
}

export function FunControls() {
  return (
    <div className="fun-touch-controls pointer-events-none absolute inset-x-4 bottom-4 z-50 items-end justify-between">
      <div className="pointer-events-auto grid grid-cols-3 gap-1.5">
        <span />
        <ControlButton code="ArrowUp" label="Move up">
          <ArrowUp size={19} />
        </ControlButton>
        <span />
        <ControlButton code="ArrowLeft" label="Move left">
          <ArrowLeft size={19} />
        </ControlButton>
        <ControlButton code="ArrowDown" label="Move down">
          <ArrowDown size={19} />
        </ControlButton>
        <ControlButton code="ArrowRight" label="Move right">
          <ArrowRight size={19} />
        </ControlButton>
      </div>

      <div className="pointer-events-auto flex items-end gap-2">
        <ControlButton code="KeyE" label="Interact">
          <MessageCircle size={19} />
        </ControlButton>
        <ControlButton code="Space" label="Jump" accent>
          <MoveUp size={21} />
        </ControlButton>
      </div>
    </div>
  );
}

