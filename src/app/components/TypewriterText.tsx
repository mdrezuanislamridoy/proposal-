import React, { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onDone?: () => void;
  className?: string;
  cursor?: boolean;
  children?: React.ReactNode;
}

export function TypewriterText({
  text,
  speed = 45,
  onDone,
  className = "",
  cursor = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    setDone(false);

    const type = () => {
      if (idx.current <= text.length) {
        setDisplayed(text.slice(0, idx.current));
        idx.current++;
        timerRef.current = setTimeout(type, speed);
      } else {
        setDone(true);
        onDone?.();
      }
    };
    timerRef.current = setTimeout(type, speed);
    return () => clearTimeout(timerRef.current);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {cursor && !done && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "#f06292",
            marginLeft: "2px",
            verticalAlign: "middle",
            animation: "blink 0.7s step-end infinite",
          }}
        />
      )}
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </span>
  );
}
