import confetti from "canvas-confetti";
import React, { useRef, useState } from "react";

type Choice = "yes" | "maybe" | "no-once" | "no-twice" | null;

interface ProposalButtonsProps {
  onChoice: (c: "yes" | "maybe" | "no") => void;
}

function launchConfetti() {
  const duration = 3200;
  const end = Date.now() + duration;
  const colors = ["#f06292", "#ff80ab", "#ce93d8", "#f8bbd9", "#ffffff"];

  const frame = () => {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();

  confetti({ particleCount: 120, spread: 100, origin: { y: 0.55 }, colors, shapes: ["circle", "square"] });
}

export function ProposalButtons({ onChoice }: ProposalButtonsProps) {
  const [choice, setChoice] = useState<Choice>(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const noRef = useRef<HTMLButtonElement>(null);
  const [noClicks, setNoClicks] = useState(0);
  const [buttonsVisible, setButtonsVisible] = useState(true);

  const handleYes = () => {
    if (choice) return;
    setChoice("yes");
    launchConfetti();
    onChoice("yes");
  };

  const handleMaybe = () => {
    if (choice) return;
    setChoice("maybe");
    onChoice("maybe");
  };

  const handleNoHover = () => {
    if (choice || noClicks >= 2) return;
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 50;
    setNoPos((p) => ({ x: p.x + Math.cos(angle) * dist, y: p.y + Math.sin(angle) * dist }));
  };

  const handleNoClick = () => {
    if (noClicks >= 2) return;
    const next = noClicks + 1;
    setNoClicks(next);
    if (next === 1) {
      setChoice("no-once");
    } else {
      setChoice("no-twice");
      onChoice("no");
      setTimeout(() => setButtonsVisible(false), 1800);
    }
  };

  const noStyle: React.CSSProperties = {
    transform: `translate(${noPos.x}px, ${noPos.y}px)`,
    transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1)",
  };

  if (!buttonsVisible) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {choice === "no-once" && (
        <p style={{ color: "#f8bbd9", fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", animation: "fadeInUp 0.4s ease", margin: 0 }}>
          Are you sure? 😢
        </p>
      )}

      <div className="flex flex-col items-center gap-6">
        {/* Yes button */}
        <button
          onClick={handleYes}
          disabled={!!choice}
          style={{
            background: choice === "yes" ? "linear-gradient(135deg, #f06292, #ce93d8)" : "linear-gradient(135deg, #e91e63, #f06292)",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            padding: "16px 56px",
            fontSize: "1.2rem",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            cursor: choice ? "default" : "pointer",
            boxShadow: "0 8px 32px rgba(233,30,99,0.45)",
            transition: "transform 0.18s, box-shadow 0.18s, opacity 0.3s",
            opacity: choice && choice !== "yes" ? 0.3 : 1,
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            if (!choice) {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(233,30,99,0.65), 0 0 0 6px rgba(233,30,99,0.15)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(233,30,99,0.45)";
          }}
        >
          💖 Yes, always
        </button>

        {/* Maybe + No row */}
        <div className="flex gap-5 relative">
          <button
            onClick={handleMaybe}
            disabled={!!choice}
            style={{
              background: "rgba(156,77,204,0.25)",
              color: "#f8bbd9",
              border: "1.5px solid rgba(240,98,146,0.4)",
              borderRadius: "50px",
              padding: "12px 32px",
              fontSize: "1rem",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              cursor: choice ? "default" : "pointer",
              backdropFilter: "blur(8px)",
              transition: "transform 0.2s, box-shadow 0.2s, opacity 0.3s",
              opacity: choice && choice !== "maybe" ? 0.3 : 1,
            }}
            onMouseEnter={(e) => {
              if (!choice) {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.06)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(156,77,204,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            😶 Maybe
          </button>

          <button
            ref={noRef}
            onClick={handleNoClick}
            onMouseEnter={handleNoHover}
            disabled={noClicks >= 2}
            style={{
              ...noStyle,
              background: "rgba(255, 255, 255, 0.06)",
              color: "rgba(252, 228, 236, 0.6)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: "50px",
              padding: "12px 32px",
              fontSize: "1rem",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              cursor: noClicks >= 2 ? "default" : "pointer",
              backdropFilter: "blur(8px)",
              opacity: choice === "no-twice" ? 0 : choice && choice !== "no-once" ? 0.3 : 1,
              transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1), opacity 1s",
            }}
          >
            ❌ No
          </button>
        </div>
      </div>
    </div>
  );
}
