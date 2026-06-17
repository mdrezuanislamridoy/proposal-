import React, { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./components/FloatingHearts";
import { MemoryCards } from "./components/MemoryCards";
import { ProposalButtons } from "./components/ProposalButtons";
import { TypewriterText } from "./components/TypewriterText";

type Section = "start" | "story1" | "story2" | "memories" | "proposal";
type FinalChoice = "yes" | "maybe" | "no" | null;

const storyMessages = [
  "We started with a simple conversation",
  "But slowly, something shifted.",
  "You became the person I looked forward to talking to every single day.",
  "Every laugh, every late night — it all meant something.",
  "And I realized… I don't want to keep this feeling to myself anymore.",
];

function GradientBackground() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let frame: number;
    const tick = () => {
      setT((prev) => prev + 0.003);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const hue1 = 270 + Math.sin(t) * 15;
  const hue2 = 320 + Math.cos(t * 0.7) * 20;

  return (
    <div
      className="fixed inset-0"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, hsl(${hue1}, 60%, 12%) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, hsl(${hue2}, 55%, 10%) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 50%, hsl(285, 50%, 8%) 0%, #0d0520 100%)
        `,
        zIndex: -1,
        transition: "background 0.1s linear",
      }}
    />
  );
}

function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/romantic.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.28;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      title={playing ? "Pause music" : "Play music"}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 100,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(240,98,146,0.3)",
        borderRadius: "50%",
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "1.2rem",
        backdropFilter: "blur(8px)",
        transition: "transform 0.2s, background 0.2s",
        color: "#f8bbd9",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)";
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(240,98,146,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(255,255,255,0.08)";
      }}
    >
      {playing ? "🎵" : "🔇"}
    </button>
  );
}

function SectionWrapper({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(24px) scale(0.97)",
        transition:
          "opacity 0.65s cubic-bezier(.4,0,.2,1), transform 0.65s cubic-bezier(.4,0,.2,1)",
        pointerEvents: visible ? "auto" : "none",
        padding: "24px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [section, setSection] = useState<Section>("start");
  const [storyIdx, setStoryIdx] = useState(0);
  const [typeDone, setTypeDone] = useState(false);
  const [finalChoice, setFinalChoice] = useState<FinalChoice>(null);

  const next = (to: Section) => {
    setTypeDone(false);
    setSection(to);
  };

  const advanceStory = () => {
    if (!typeDone) return;
    if (storyIdx < storyMessages.length - 1) {
      setStoryIdx((i) => i + 1);
      setTypeDone(false);
    } else {
      next("memories");
    }
  };

  const handleChoice = (c: "yes" | "maybe" | "no") => {
    setFinalChoice(c);
  };

  return (
    <div
      className="size-full relative overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh" }}
    >
      <GradientBackground />
      <FloatingHearts />
      <MusicToggle />

      {/* SECTION: Start */}
      <SectionWrapper visible={section === "start"}>
        <div className="flex flex-col items-center gap-8 text-center max-w-lg">
          <div style={{ fontSize: "4rem", lineHeight: 1 }}>💌</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              color: "#fce4ec",
              fontWeight: 600,
              lineHeight: 1.3,
              textShadow: "0 2px 24px rgba(240,98,146,0.4)",
            }}
          >
            I have something to tell you…
          </h1>
          <p
            style={{
              color: "rgba(252,228,236,0.65)",
              fontSize: "1rem",
              maxWidth: 320,
              lineHeight: 1.6,
            }}
          >
            Something I've been holding close for a while now.
          </p>
          <button
            onClick={() => {
              setStoryIdx(0);
              setTypeDone(false);
              next("story1");
            }}
            style={{
              background: "linear-gradient(135deg, #e91e63, #9c4dcc)",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "16px 48px",
              fontSize: "1.15rem",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow:
                "0 8px 32px rgba(233,30,99,0.4), 0 0 0 0 rgba(233,30,99,0)",
              transition: "transform 0.2s, box-shadow 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.07) translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 12px 40px rgba(233,30,99,0.6), 0 0 0 8px rgba(233,30,99,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 32px rgba(233,30,99,0.4)";
            }}
          >
            Start 💌
          </button>
        </div>
      </SectionWrapper>

      {/* SECTION: Story */}
      <SectionWrapper visible={section === "story1"}>
        <div
          className="flex flex-col items-center gap-10 text-center max-w-xl w-full"
          onClick={advanceStory}
          style={{ cursor: typeDone ? "pointer" : "default" }}
        >
          {/* Progress dots */}
          <div className="flex gap-2">
            {storyMessages.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === storyIdx ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    i < storyIdx
                      ? "#f06292"
                      : i === storyIdx
                        ? "linear-gradient(90deg,#e91e63,#ce93d8)"
                        : "rgba(240,98,146,0.2)",
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>

          <div
            style={{
              minHeight: "8rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p className="story-text">
              <TypewriterText
                key={storyIdx}
                text={storyMessages[storyIdx]}
                speed={42}
                onDone={() => setTypeDone(true)}
                cursor
              />
            </p>
          </div>

          {typeDone && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  color: "rgba(252,228,236,0.45)",
                  fontSize: "0.82rem",
                  animation: "pulseHint 2s ease-in-out infinite",
                }}
              >
                {storyIdx < storyMessages.length - 1
                  ? "tap anywhere or click Next…"
                  : "tap anywhere or click below ✨"}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  advanceStory();
                }}
                style={{
                  background: "linear-gradient(135deg, #e91e63, #9c4dcc)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50px",
                  padding: "12px 40px",
                  fontSize: "1rem",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 6px 28px rgba(233,30,99,0.45)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  letterSpacing: "0.03em",
                  animation: "fadeInUp 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.08) translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 10px 36px rgba(233,30,99,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 6px 28px rgba(233,30,99,0.45)";
                }}
              >
                {storyIdx < storyMessages.length - 1
                  ? "Next →"
                  : "See something special ✨"}
              </button>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* SECTION: Memories */}
      <SectionWrapper visible={section === "memories"}>
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              color: "#fce4ec",
              textAlign: "center",
              textShadow: "0 2px 20px rgba(240,98,146,0.35)",
            }}
          >
            Our little world 🌸
          </h2>
          <p
            style={{
              color: "rgba(252,228,236,0.6)",
              textAlign: "center",
              fontSize: "0.95rem",
            }}
          >
            Swipe through the moments that brought us here
          </p>
          <MemoryCards />
          <button
            onClick={() => next("proposal")}
            style={{
              marginTop: 8,
              background: "linear-gradient(135deg, #e91e63, #9c4dcc)",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "14px 44px",
              fontSize: "1.05rem",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 28px rgba(233,30,99,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.07)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 10px 36px rgba(233,30,99,0.55)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 28px rgba(233,30,99,0.4)";
            }}
          >
            There's one more thing… 💝
          </button>
        </div>
      </SectionWrapper>

      {/* SECTION: Proposal */}
      <SectionWrapper visible={section === "proposal"}>
        <div className="flex flex-col items-center gap-8 text-center max-w-lg px-4">
          <div style={{ fontSize: "3.5rem" }}>💍</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
              color: "#fce4ec",
              fontWeight: 700,
              lineHeight: 1.3,
              textShadow: "0 2px 24px rgba(240,98,146,0.5)",
            }}
          >
            Will you give me a chance?
          </h1>
          <p
            style={{
              color: "rgba(252,228,236,0.7)",
              fontSize: "1rem",
              lineHeight: 1.6,
              maxWidth: 340,
            }}
          >
            Not forever — just a beginning. One moment to see what we could be.
          </p>

          {/* Response messages */}
          {finalChoice === "yes" && (
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
                color: "#f06292",
                fontStyle: "italic",
                textShadow: "0 0 32px rgba(240,98,146,0.6)",
                animation: "fadeInUp 0.6s ease",
              }}
            >
              You just made me the happiest person 💖
            </div>
          )}
          {finalChoice === "maybe" && (
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                color: "#ce93d8",
                fontStyle: "italic",
                animation: "fadeInUp 0.5s ease",
              }}
            >
              It's okay… take your time. I'll wait 😊
            </div>
          )}
          {finalChoice === "no" && (
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1rem, 3vw, 1.3rem)",
                color: "rgba(252,228,236,0.7)",
                fontStyle: "italic",
                animation: "fadeInUp 0.5s ease",
              }}
            >
              I understand… I still value you as my closest person. 🤍
            </div>
          )}
          {!finalChoice && <ProposalButtons onChoice={handleChoice} />}

          {/* Heart explosion on yes */}
          {finalChoice === "yes" && (
            <div
              className="flex gap-3 flex-wrap justify-center"
              style={{ fontSize: "2rem" }}
            >
              {["💖", "💕", "💗", "💓", "💝", "✨", "🌸"].map((e, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    animation: `heartPop 0.5s ${i * 0.08}s ease both`,
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* Global styles */}
      <style>{`
        @keyframes pulseHint {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.9; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartPop {
          0% { opacity: 0; transform: scale(0) rotate(-20deg); }
          60% { opacity: 1; transform: scale(1.3) rotate(10deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow: hidden; }
        .story-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.3rem, 4vw, 2rem);
          color: #fce4ec;
          font-style: italic;
          line-height: 1.5;
          text-shadow: 0 2px 16px rgba(240,98,146,0.3);
        }
      `}</style>
    </div>
  );
}
