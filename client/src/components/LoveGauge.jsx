import { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useHeartSound } from "../hooks/useHeartSound";

const LOVES_PER_LEVEL = 10;

export default function LoveGauge({ sparkCount }) {
  const level = Math.floor(sparkCount / LOVES_PER_LEVEL) + 1;
  const progress = sparkCount % LOVES_PER_LEVEL; // 0–9
  const percentage = (progress / LOVES_PER_LEVEL) * 100;

  const [pulse, setPulse] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const prevCount = useRef(sparkCount);
  const prevLevel = useRef(level);
  const { playLevelUp } = useHeartSound();

  useEffect(() => {
    if (sparkCount > prevCount.current) {
      // Pulse ad ogni nuovo love
      setPulse(true);
      setTimeout(() => setPulse(false), 600);

      // Level up
      if (level > prevLevel.current) {
        setLevelUp(true);
        playLevelUp();
        setTimeout(() => setLevelUp(false), 1000);
        prevLevel.current = level;
      }

      prevCount.current = sparkCount;
    }
  }, [sparkCount]);

  return (
    <div className="flex items-center gap-2">
      {/* Livello */}
      <span
        className="text-xs font-bold whitespace-nowrap transition-all duration-300"
        style={{
          color: levelUp ? "#facc15" : "rgba(255,255,255,0.5)",
          transform: levelUp ? "scale(1.3)" : "scale(1)",
          textShadow: levelUp ? "0 0 8px #facc15" : "none",
          display: "inline-block",
          transition: "all 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
        }}
      >
        Lvl: {level}
      </span>

      {/* Gauge container */}
      <div className="relative flex items-center gap-1.5">
        {/* Barra */}
        <div
          className="relative w-20 h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          {/* Fill */}
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${percentage}%`,
              background: levelUp
                ? "linear-gradient(90deg, #facc15, #fb923c)"
                : "#E8000D",
              boxShadow: pulse ? "0 0 10px 3px rgba(232,0,13,0.7)" : "none",
              transition: levelUp
                ? "width 0.1s ease, background 0.3s ease, box-shadow 0.3s ease"
                : "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
            }}
          />

          {/* Flash bianco al level up */}
          {levelUp && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "white",
                animation: "flash-out 0.5s ease forwards",
              }}
            />
          )}
        </div>

        {/* Numero cuori con icona */}
        <div className="flex items-center gap-0.5">
          <FaHeart
            className="text-[#E8000D]"
            style={{
              fontSize: "10px",
              transform: pulse ? "scale(1.5)" : "scale(1)",
              transition: "transform 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
            }}
          />
          <span
            className="text-xs font-semibold tabular-nums"
            style={{
              color: pulse ? "#E8000D" : "rgba(255,255,255,0.5)",
              transition: "color 0.3s ease",
            }}
          >
            {sparkCount}
          </span>
        </div>
      </div>
    </div>
  );
}
