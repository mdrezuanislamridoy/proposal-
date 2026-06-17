import { useRef, useState } from "react";

const memories = [
  {
    emoji: "💬",
    title: "First Conversation",
    desc: "Remember how it started with a simple 'hi'? Neither of us knew that one word would change everything.",
    color: "from-pink-900/60 to-purple-900/60",
  },
  {
    emoji: "😂",
    title: "Funny Moments",
    desc: "All the times we laughed until it hurt. Those silly inside jokes no one else understands but us.",
    color: "from-purple-900/60 to-indigo-900/60",
  },
  {
    emoji: "🌙",
    title: "Late Night Talks",
    desc: "2 AM conversations about everything and nothing. The world felt quiet, but between us — alive.",
    color: "from-indigo-900/60 to-pink-900/60",
  },
  {
    emoji: "🌸",
    title: "Small Moments",
    desc: "A song that reminded me of you. A random thought I wanted to share — always with you.",
    color: "from-rose-900/60 to-purple-900/60",
  },
  {
    emoji: "💫",
    title: "When I Realized",
    desc: "There was a quiet moment I knew — you weren't just a friend anymore. You were something more.",
    color: "from-fuchsia-900/60 to-indigo-900/60",
  },
];

interface CardProps {
  memory: (typeof memories)[0];
  index: number;
}

function MemoryCard({ memory, index }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -12, y: dx * 12 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={{
        transform: hovered
          ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.04)`
          : "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform 0.18s ease",
        animationDelay: `${index * 0.12}s`,
      }}
      className={`relative flex-shrink-0 w-64 rounded-2xl p-6 cursor-pointer bg-gradient-to-br ${memory.color} backdrop-blur-sm border border-white/10`}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 0.15 : 0,
          background:
            "radial-gradient(circle at center, rgba(240,98,146,0.4), transparent 70%)",
        }}
      />
      <div className="relative z-10">
        <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{memory.emoji}</div>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#fce4ec",
            marginBottom: "8px",
          }}
        >
          {memory.title}
        </h3>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            color: "rgba(252, 228, 236, 0.8)",
            fontSize: "0.875rem",
            lineHeight: 1.6,
          }}
        >
          {memory.desc}
        </p>
      </div>
    </div>
  );
}

export function MemoryCards() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 px-4 snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {memories.map((m, i) => (
          <div key={i} className="snap-center">
            <MemoryCard memory={m} index={i} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {memories.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = scrollRef.current;
              if (!el) return;
              const cards = el.querySelectorAll(".snap-center");
              cards[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "none",
              background: "rgba(240, 98, 146, 0.5)",
              cursor: "pointer",
              padding: 0,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = "#f06292")}
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.background = "rgba(240, 98, 146, 0.5)")
            }
          />
        ))}
      </div>
    </div>
  );
}
