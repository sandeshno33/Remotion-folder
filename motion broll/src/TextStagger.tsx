import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TitleStaggerProps {
  startFrame: number;
}

export const TitleStagger: React.FC<TitleStaggerProps> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = "Rebuzz Ordering";
  // Convert 30ms to frames: 0.03s * 30fps = 0.9 frames. Let's use a solid 1-frame stagger.
  const staggerFrames = 1;

  return (
    <h1
      className="text-white text-center font-extrabold select-none flex justify-center flex-nowrap"
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        fontSize: "86px",
        letterSpacing: "0.08em",
        lineHeight: "1.1",
        width: "100%",
        whiteSpace: "nowrap",
      }}
    >
      {text.split("").map((char, index) => {
        // Handle spaces beautifully
        if (char === " ") {
          return (
            <span key={index} style={{ display: "inline-block", width: 34 }} />
          );
        }

        const charStart = startFrame + index * staggerFrames;
        const charFrame = frame - charStart;

        // Custom spring animation for each character
        const scale = spring({
          frame: charFrame,
          fps,
          config: {
            damping: 12,
            mass: 0.4,
            stiffness: 110,
          },
          from: 0,
          to: 1,
        });

        const translateY = interpolate(scale, [0, 1], [84, 0]);
        const opacity = interpolate(scale, [0, 1], [0, 1]);

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity: opacity,
              textShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
            }}
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
};

interface TaglineStaggerProps {
  startFrame: number;
}

export const TaglineStagger: React.FC<TaglineStaggerProps> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Words grouped into 2-3 words per group as requested:
  // "is here to change your local shopping experience."
  const wordGroups = [
    "is here to change your",

    "local shopping experience.",

  ];

  // 80ms stagger: 0.08s * 30fps = 2.4 frames
  const staggerFrames = 2.4;

  return (
    <div
      className="text-center font-normal flex flex-col items-center gap-3 w-[85%]"
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 400,
        fontSize: "70px",
        lineHeight: "1.3",
        color: "rgba(255, 255, 255, 0.8)", // 80% opacity
      }}
    >
      {wordGroups.map((group, groupIndex) => {
        const groupStart = startFrame + groupIndex * staggerFrames;
        const groupFrame = frame - groupStart;

        // Animate scale/position using spring
        const animProgress = spring({
          frame: groupFrame,
          fps,
          config: {
            damping: 15,
            mass: 0.5,
            stiffness: 90,
          },
          from: 0,
          to: 1,
        });

        const translateY = interpolate(animProgress, [0, 1], [42, 0]);
        const opacity = interpolate(animProgress, [0, 1], [0, 0.8]); // max opacity 80%

        return (
          <div
            key={groupIndex}
            style={{
              transform: `translateY(${translateY}px)`,
              opacity: opacity,
              display: "inline-block",
              whiteSpace: "nowrap",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            {group}
          </div>
        );
      })}
    </div>
  );
};
