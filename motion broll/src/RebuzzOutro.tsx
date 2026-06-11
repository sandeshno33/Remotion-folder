import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, Sequence, staticFile } from "remotion";

// ============================================================
// REBUZZ ORDERING — OUTRO COMPOSITION
// Script: "One app. Endless possibilities. Scan this QR code
//          to download the Rebuzz ordering app."
// 1080x1920 @ 30fps | Duration: 5 seconds (150 frames)
// Aesthetic: Dark Cyberpunk / Tech-Corporate
// ============================================================
const FPS = 30;

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

// ─── Easing helpers ──────────────────────────────────────────
const spr = (frame: number, delay: number, fps: number, cfg = {}) =>
  spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120, mass: 0.8, ...cfg } });

const fadeIn = (frame: number, delay: number, duration: number) =>
  interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ─── Cyber Grid Background ───────────────────────────────────
const GridBG: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = fadeIn(frame, 0, 15);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        backgroundImage: `
          linear-gradient(to right, ${C.grid} 1px, transparent 1px),
          linear-gradient(to bottom, ${C.grid} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        backgroundPosition: "center center",
      }}
    />
  );
};

// ─── Floating Geometric Tech Particles ────────────────────────
const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const pList = [
    { x: 150, y: 300, size: 28, rot: 15, speed: 0.4 },
    { x: 920, y: 450, size: 36, rot: 45, speed: -0.3 },
    { x: 100, y: 1100, size: 24, rot: 120, speed: 0.5 },
    { x: 900, y: 1350, size: 32, rot: -60, speed: -0.4 },
    { x: 200, y: 1650, size: 28, rot: 80, speed: 0.35 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pList.map((p, i) => {
        const driftY = (frame * p.speed * 1.5) % 120;
        const spin = p.rot + frame * 0.4;
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
              opacity: 0.18,
              transform: `rotate(${spin}deg)`,
              clipPath: i % 2 === 0 
                ? "polygon(50% 0%, 100% 100%, 0% 100%)" // Triangle
                : "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", // Hexagon
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Corner Brackets Overlay ─────────────────────────────────
const CornerBrackets: React.FC<{ frame: number }> = ({ frame }) => {
  const s = spr(frame, 0, FPS, { damping: 11, stiffness: 100 });
  const offset = interpolate(s, [0, 1], [150, 48]); // Snap inward
  const len = 70;
  const th = 4; // Thickness

  const bracketStyle: React.CSSProperties = {
    position: "absolute",
    borderColor: C.orange,
    borderStyle: "solid",
    width: len,
    height: len,
    filter: `drop-shadow(0 0 10px rgba(232, 98, 10, 0.45))`,
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Top Left */}
      <div style={{ ...bracketStyle, left: offset, top: offset, borderLeftWidth: th, borderTopWidth: th }} />
      {/* Top Right */}
      <div style={{ ...bracketStyle, right: offset, top: offset, borderRightWidth: th, borderTopWidth: th }} />
      {/* Bottom Left */}
      <div style={{ ...bracketStyle, left: offset, bottom: offset, borderLeftWidth: th, borderBottomWidth: th }} />
      {/* Bottom Right */}
      <div style={{ ...bracketStyle, right: offset, bottom: offset, borderRightWidth: th, borderBottomWidth: th }} />
    </AbsoluteFill>
  );
};

// ─── Glowing Halo / Pulse Background ─────────────────────────
const GlowHalo: React.FC<{ frame: number; delay: number }> = ({ frame, delay }) => {
  const pulse = 0.8 + 0.2 * Math.sin((frame - delay) * 0.12);
  const opacity = fadeIn(frame, delay, 15) * 0.25;

  return (
    <div
      style={{
        position: "absolute",
        width: 650,
        height: 650,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(232, 98, 10, 0.12) 0%, rgba(26, 47, 90, 0.05) 50%, transparent 70%)`,
        transform: `scale(${pulse})`,
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

// ─── Brand Logo Header Component ────────────────────────────
const BrandLogoHeader: React.FC<{ frame: number }> = ({ frame }) => {
  const START = 35;
  const s = spr(frame, START, FPS, { damping: 12, stiffness: 110 });
  const opacity = fadeIn(frame, START, 10);
  const scale = interpolate(s, [0, 1], [0.6, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: "50%",
        transform: `translateX(-50%) scale(${scale})`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 5,
      }}
    >
      {/* Logo container circle */}
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 40,
          background: "#141B26",
          border: `1.5px solid rgba(232, 98, 10, 0.3)`,
          boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(232, 98, 10, 0.15)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <img
          src={staticFile("asset/logo .png")}
          alt="Rebuzz Logo"
          style={{
            width: 88,
            height: 88,
            objectFit: "contain",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 32,
          color: C.white,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        REBUZZ ORDERING
      </span>
    </div>
  );
};

// ─── Outro Core Headline ─────────────────────────────────────
const OutroHeadline: React.FC<{ frame: number }> = ({ frame }) => {
  const START = 12;
  const s = spr(frame, START, FPS, { damping: 13, stiffness: 110 });
  const opacity = fadeIn(frame, START, 12);
  const scale = interpolate(s, [0, 1], [0.8, 1]);
  const slideY = interpolate(s, [0, 1], [30, 0]);

  // Underline sweep progress
  const sweepWidth = interpolate(frame, [START + 12, START + 32], [0, 680], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 480,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        transform: `translateY(${slideY}px) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 5,
      }}
    >
      <h1
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: 66,
          color: C.white,
          margin: 0,
          letterSpacing: "0.04em",
          textShadow: "0 4px 15px rgba(0,0,0,0.5)",
          textTransform: "uppercase",
        }}
      >
        One App.{" "}
        <span
          style={{
            color: C.orange,
            textShadow: `0 0 30px rgba(232, 98, 10, 0.6)`,
          }}
        >
          Endless Possibilities.
        </span>
      </h1>

      {/* Decorative sweep underline */}
      <div
        style={{
          marginTop: 18,
          height: 3,
          width: sweepWidth,
          background: `linear-gradient(90deg, transparent, ${C.orange} 20%, ${C.orange} 80%, transparent)`,
          borderRadius: 2,
          boxShadow: `0 0 10px rgba(232, 98, 10, 0.5)`,
        }}
      />
    </div>
  );
};

// ─── Tech QR Code Card ───────────────────────────────────────
const QRCodeCard: React.FC<{ frame: number }> = ({ frame }) => {
  const START = 70;
  const s = spr(frame, START, FPS, { damping: 11, stiffness: 105, mass: 0.95 });
  const scale = interpolate(s, [0, 1], [0.5, 1]);
  const opacity = fadeIn(frame, START, 12);
  const rotate = interpolate(s, [0, 1], [-8, 0]);

  // Specular gleam sweeps across the card at frame 98
  const gleamProgress = interpolate(frame, [START + 18, START + 38], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 720,
        left: "50%",
        transform: `translateX(-50%) scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 480,
          height: 480,
          borderRadius: 32,
          background: "rgba(20, 27, 38, 0.8)",
          border: `1.5px solid rgba(232, 98, 10, 0.25)`,
          boxShadow: `
            0 30px 60px rgba(0,0,0,0.6), 
            0 0 40px rgba(232, 98, 10, 0.08)
          `,
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glowing Specular Sweep Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 80,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)`,
            transform: `skewX(-25deg) translateX(${gleamProgress}%)`,
            pointerEvents: "none",
          }}
        />

        {/* 4 Corner Crosshairs for tech styling */}
        {[
          { left: 16, top: 16, borderLeft: "3px solid #E8620A", borderTop: "3px solid #E8620A" },
          { right: 16, top: 16, borderRight: "3px solid #E8620A", borderTop: "3px solid #E8620A" },
          { left: 16, bottom: 16, borderLeft: "3px solid #E8620A", borderBottom: "3px solid #E8620A" },
          { right: 16, bottom: 16, borderRight: "3px solid #E8620A", borderBottom: "3px solid #E8620A" },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 24,
              height: 24,
              ...c,
              filter: `drop-shadow(0 0 4px rgba(232, 98, 10, 0.8))`,
            }}
          />
        ))}

        {/* Inner QR Code container with clean white backing */}
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: 20,
            background: C.white,
            padding: 24,
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.1), 0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={staticFile("asset/qr.png")}
            alt="Scan QR to Download"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "crisp-edges",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Outro Action Instruction Tagline ────────────────────────
const OutroTagline: React.FC<{ frame: number }> = ({ frame }) => {
  const START = 105;
  const s = spr(frame, START, FPS, { damping: 14, stiffness: 100 });
  const opacity = fadeIn(frame, START, 12);
  const slideY = interpolate(s, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 460,
        left: "50%",
        transform: `translateX(-50%) translateY(${slideY}px)`,
        opacity,
        width: 820,
        textAlign: "center",
        zIndex: 5,
      }}
    >
      <span
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 600,
          fontSize: 32,
          color: C.white,
          lineHeight: 1.5,
          letterSpacing: "0.02em",
          opacity: 0.85,
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        Scan this QR code to download the{" "}
        <span style={{ color: C.orange, fontWeight: 700, textShadow: "0 0 15px rgba(232,98,10,0.3)" }}>
          Rebuzz ordering app
        </span>
        .
      </span>
    </div>
  );
};

// ─── Final Fade Transition ───────────────────────────────────
const FinalFadeOut: React.FC<{ frame: number; totalFrames: number }> = ({ frame, totalFrames }) => {
  const opacity = interpolate(
    frame,
    [totalFrames - 10, totalFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{ background: "#000", opacity, pointerEvents: "none", zIndex: 100 }}
    />
  );
};

// ─── MAIN OUTRO COMPOSITION ──────────────────────────────────
export const RebuzzOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily: "Barlow, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background Cyber Grid */}
      <GridBG frame={frame} />

      {/* Floating Particles */}
      <Particles frame={frame} />

      {/* Corner Tech Brackets */}
      <CornerBrackets frame={frame} />

      {/* Radial Orange Glow Halo (positioned behind QR Code) */}
      <div style={{ position: "absolute", top: 960, left: "50%", transform: "translate(-50%, -50%)" }}>
        <GlowHalo frame={frame} delay={70} />
      </div>

      {/* Brand Logo Header */}
      <BrandLogoHeader frame={frame} />

      {/* Outro Headline text */}
      <OutroHeadline frame={frame} />

      {/* Outro QR Code Card */}
      <QRCodeCard frame={frame} />

      {/* Outro Instruction Tagline */}
      <OutroTagline frame={frame} />

      {/* Scanline Overlay Grid */}
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
          opacity: 1.0,
          zIndex: 30,
        }}
      />

      {/* Outro Final Scene Transition */}
      <FinalFadeOut frame={frame} totalFrames={durationInFrames} />

      {/* ─── Synchronized Cinematic Outro SFX Sequences ─── */}
      {/* 1. Corner Brackets Snap-In Whoosh (starts at Frame 0) */}
      <Sequence from={0} durationInFrames={30} name="Brackets Entrance Whoosh">
        <Audio src={staticFile("asset/whoosh.wav")} volume={0.35} />
      </Sequence>

      {/* 2. Headline Sweep Whoosh (starts at Frame 12) */}
      <Sequence from={12} durationInFrames={35} name="Headline Entrance Whoosh">
        <Audio src={staticFile("asset/whoosh.wav")} volume={0.45} />
      </Sequence>

      {/* 3. Brand Logo bounce pop (starts at Frame 35) */}
      <Sequence from={35} durationInFrames={30} name="Logo Bounce Pop">
        <Audio src={staticFile("asset/pop.mp3")} volume={0.55} />
      </Sequence>

      {/* 4. QR Code Card Entrance Pop (starts at Frame 70) */}
      <Sequence from={70} durationInFrames={35} name="QR Code Card Pop">
        <Audio src={staticFile("asset/pop.mp3")} volume={0.6} />
      </Sequence>

      {/* 5. Instruction Tagline Settle Ding (starts at Frame 105) */}
      <Sequence from={105} durationInFrames={40} name="Tagline Settle Ding">
        <Audio src={staticFile("asset/ding.wav")} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default RebuzzOutro;
