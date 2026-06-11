import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence, Audio, staticFile } from "remotion";
import { Logo } from "./Logo";
import { TaglineStagger, TitleStagger } from "./TextStagger";

// ─── Brand Colors ────────────────────────────────────────────
const C = {
  bg: "#0D1118",
  bgCard: "#141B26",
  orange: "#E8620A",
  orangeGlow: "#FF7B24",
  navy: "#1A2F5A",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.65)",
  grid: "rgba(232,98,10,0.07)",
};

// ─── Cyber Grid Background ───────────────────────────────────
const GridBG: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: opacity * 0.7, // Subtle grid representation
        backgroundImage: `
          linear-gradient(to right, ${C.grid} 1px, transparent 1px),
          linear-gradient(to bottom, ${C.grid} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        backgroundPosition: "center center",
        pointerEvents: "none",
      }}
    />
  );
};

// ─── Floating Geometric Tech Particles ────────────────────────
const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const pList = [
    { x: 120, y: 350, size: 24, rot: 15, speed: 0.35, shape: "tri" },
    { x: 920, y: 550, size: 30, rot: 45, speed: -0.28, shape: "hex" },
    { x: 140, y: 1150, size: 26, rot: 110, speed: 0.45, shape: "hex" },
    { x: 880, y: 1400, size: 32, rot: -40, speed: -0.32, shape: "tri" },
    { x: 220, y: 1700, size: 22, rot: 75, speed: 0.3, shape: "hex" },
    { x: 940, y: 250, size: 20, rot: 90, speed: -0.4, shape: "tri" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      {pList.map((p, i) => {
        const driftY = (frame * p.speed * 1.5) % 150;
        const spin = p.rot + frame * 0.35;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y - driftY,
              width: p.size,
              height: p.size,
              border: `1.5px solid ${C.orange}`,
              opacity: 0.12,
              transform: `rotate(${spin}deg)`,
              clipPath: p.shape === "tri"
                ? "polygon(50% 0%, 100% 100%, 0% 100%)" // Triangle
                : "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", // Hexagon
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Corner Tech Brackets ─────────────────────────────────────
const CornerBrackets: React.FC<{ frame: number }> = ({ frame }) => {
  const s = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 95, mass: 0.8 },
    from: 0,
    to: 1,
  });
  const offset = interpolate(s, [0, 1], [180, 48]); // Springs inward to margins
  const len = 70;
  const th = 4;

  const bracketStyle: React.CSSProperties = {
    position: "absolute",
    borderColor: C.orange,
    borderStyle: "solid",
    width: len,
    height: len,
    filter: `drop-shadow(0 0 12px rgba(232, 98, 10, 0.5))`,
    pointerEvents: "none",
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
      {/* Top Left */}
      <div style={{ ...bracketStyle, left: offset, top: offset, borderLeftWidth: th, borderTopWidth: th }} />
      {/* Top Right */}
      <div style={{ ...bracketStyle, right: offset, top: offset, borderRightWidth: th, borderTopWidth: th }} />
      {/* Bottom Left */}
      <div style={{ ...bracketStyle, left: offset, bottom: offset, borderLeftWidth: th, borderBottomWidth: th }} />
      {/* Bottom Right */}
      <div style={{ ...bracketStyle, right: offset, bottom: offset, borderRightWidth: th, borderBottomWidth: th }} />
    </div>
  );
};

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ==================== TIMELINE CONFIGURATION ====================

  // 1. Sweep-in of faint circular arc from right (0.0s – 0.8s / Frames 0 to 24)
  const ringSweepProgress = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * (2 - t), // smooth deceleration
  });

  // 2. Logo App Icon pops in (0.8s – 1.8s / Frames 24 to 54)
  // Scale spring: 0 to 1 with overshoot bounce (damping = 11 creates organic overshoot)
  const logoIntroSpring = spring({
    frame: frame - 24,
    fps,
    config: {
      damping: 11,
      mass: 0.6,
      stiffness: 90,
    },
    from: 0,
    to: 1,
  });

  // Rotate ring 180 degrees clockwise into place
  const ringSpinSpring = spring({
    frame: frame - 24,
    fps,
    config: {
      damping: 13,
      mass: 0.55,
      stiffness: 85,
    },
    from: 0,
    to: 1,
  });
  const ringRotation = interpolate(ringSpinSpring, [0, 1], [-180, 0]);

  // Bee/firefly wing-flutter shimmer active between frame 24 and 54
  const wingFlutterActive = frame >= 24 && frame <= 54;

  // 3. Logo settles and breathes (1.8s – 2.2s / Frames 54 to 66)
  let breatheScale = 1.0;
  if (frame >= 54 && frame <= 66) {
    const pulseAngle = ((frame - 54) / 12) * Math.PI;
    breatheScale = 1.0 + Math.sin(pulseAngle) * 0.03; // peak scale 1.03
  }

  // 4. Title "Rebuzz Ordering" slides up (2.2s – 3.0s / Frames 66 to 90)
  const showTitle = frame >= 66;

  // 5. Secondary tagline fades/slides up (3.0s – 5.2s / Frames 90 to 156)
  const showTagline = frame >= 90;

  // 6. Whole scene fades to black & logo dissolves (5.2s – 6.0s / Frames 156 to 180)
  const finalGlowActive = frame >= 156;

  // Dissolves (shrinks & fades) between frame 156 and 172
  const dissolveProgress = interpolate(frame, [156, 172], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t, // accelerates out
  });

  // Screen fade overlay opacity from 0 to 1
  const screenFadeOpacity = interpolate(frame, [156, 178], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: "'Poppins', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background Cyber Grid */}
      <GridBG frame={frame} />

      {/* Floating Particles */}
      <Particles frame={frame} />

      {/* Snap-in Corner Brackets */}
      <CornerBrackets frame={frame} />

      {/* ==================== BACKGROUND GLOW EFFECTS ==================== */}
      {/* Radial Navy Glow Spot */}
      <div
        style={{
          position: "absolute",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26, 47, 90, 0.4) 0%, rgba(26, 47, 90, 0) 70%)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          opacity: (1 - dissolveProgress) * 0.8,
        }}
      />

      {/* Radial Orange Center Glow Spot */}
      <div
        style={{
          position: "absolute",
          width: "650px",
          height: "650px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232, 98, 10, 0.12) 0%, rgba(232, 98, 10, 0) 70%)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          opacity: 1 - dissolveProgress,
        }}
      />

      {/* ==================== CONTENT STACK ==================== */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Centered App Icon Logo */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "460px",
            width: "100%",
            position: "relative",
            transform: "scale(0.55)", // Scale down to prevent overlapping the staggered title below
          }}
        >
          <Logo
            progress={logoIntroSpring}
            ringRotation={ringRotation}
            ringSweepProgress={ringSweepProgress}
            wingFlutterActive={wingFlutterActive}
            breatheScale={breatheScale}
            finalGlowActive={finalGlowActive}
            dissolveProgress={dissolveProgress}
          />
        </div>

        {/* Title Area */}
        <div
          style={{
            height: "168px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {showTitle && <TitleStagger startFrame={66} />}
        </div>

        {/* Tagline Area */}
        <div
          style={{
            height: "336px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
            marginTop: 20,
          }}
        >
          {showTagline && <TaglineStagger startFrame={90} />}
        </div>
      </div>

      {/* ==================== SCANLINE OVERLAY ==================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 3px
          )`,
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      {/* ==================== SCENE FADE OUT OVERLAY ==================== */}
      {finalGlowActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#000000",
            opacity: screenFadeOpacity,
            pointerEvents: "none",
            zIndex: 50,
          }}
        />
      )}

      {/* ==================== SYNCHRONIZED CINEMATIC AUDIO TRACKS ==================== */}
      {/* 1. Brand Logo Spring Pop SFX (starts exactly at Frame 24) */}
      <Sequence from={24} durationInFrames={40} name="Logo Pop SFX">
        <Audio src={staticFile("asset/pop.mp3")} volume={0.65} />
      </Sequence>

      {/* 2. Kinetic Title Stagger Whoosh SFX (starts exactly at Frame 66) */}
      <Sequence from={66} durationInFrames={45} name="Title Whoosh SFX">
        <Audio src={staticFile("asset/whoosh.wav")} volume={0.4} />
      </Sequence>

      {/* 3. Tagline Word Stagger Ding SFX (starts exactly at Frame 90) */}
      <Sequence from={90} durationInFrames={50} name="Tagline Settle SFX">
        <Audio src={staticFile("asset/ding.wav")} volume={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};
