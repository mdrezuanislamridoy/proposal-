import { useEffect, useRef, useState } from "react";

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  sway: number;
  swayOffset: number;
  emoji: string;
}

interface CursorHeart {
  id: number;
  x: number;
  y: number;
  born: number;
}

const EMOJIS = ["💖", "💕", "💗", "💓", "💝", "✨", "🌸", "💫"];

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [cursorHearts, setCursorHearts] = useState<CursorHeart[]>([]);
  const nextId = useRef(0);
  const cursorId = useRef(0);
  const frameRef = useRef<number>(0);
  const lastCursor = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const initial: Heart[] = Array.from({ length: 18 }, (_, i) => ({
      id: nextId.current++,
      x: Math.random() * 100,
      y: 105 + Math.random() * 20,
      size: 12 + Math.random() * 20,
      opacity: 0.15 + Math.random() * 0.45,
      speed: 0.015 + Math.random() * 0.03,
      sway: 1.5 + Math.random() * 3,
      swayOffset: Math.random() * Math.PI * 2,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }));
    setHearts(initial);

    let t = 0;
    const animate = () => {
      t += 0.012;
      setHearts((prev) =>
        prev.map((h) => {
          let y = h.y - h.speed;
          let x = h.x + Math.sin(t * h.sway + h.swayOffset) * 0.04;
          if (y < -8) {
            y = 108;
            x = Math.random() * 100;
          }
          return { ...h, x, y };
        })
      );
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - lastCursor.current.x);
      const dy = Math.abs(e.clientY - lastCursor.current.y);
      if (dx + dy < 12) return;
      lastCursor.current = { x: e.clientX, y: e.clientY };
      if (Math.random() > 0.55) return;
      const id = cursorId.current++;
      setCursorHearts((prev) => [
        ...prev.slice(-15),
        { id, x: e.clientX, y: e.clientY, born: Date.now() },
      ]);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setCursorHearts((prev) => prev.filter((h) => now - h.born < 1400));
    }, 300);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      {/* Background floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {hearts.map((h) => (
          <span
            key={h.id}
            style={{
              position: "absolute",
              left: `${h.x}%`,
              top: `${h.y}%`,
              fontSize: `${h.size}px`,
              opacity: h.opacity,
              transform: "translate(-50%, -50%)",
              userSelect: "none",
              filter: "blur(0.3px)",
              transition: "none",
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>

      {/* Cursor trail hearts */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
        {cursorHearts.map((h) => {
          const age = (Date.now() - h.born) / 1400;
          return (
            <span
              key={h.id}
              style={{
                position: "fixed",
                left: h.x,
                top: h.y,
                fontSize: `${12 + Math.random() * 8}px`,
                opacity: 1 - age,
                transform: `translate(-50%, -50%) translateY(${-age * 30}px) scale(${1 - age * 0.4})`,
                userSelect: "none",
                pointerEvents: "none",
                animation: "none",
              }}
            >
              💖
            </span>
          );
        })}
      </div>
    </>
  );
}
