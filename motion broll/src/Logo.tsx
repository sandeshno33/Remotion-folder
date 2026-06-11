import React from "react";
import { staticFile, useCurrentFrame } from "remotion";

interface LogoProps {
  progress: number; // 0 to 1 for intro scale pop
  ringRotation?: number;
  ringSweepProgress?: number;
  wingFlutterActive?: boolean;
  breatheScale: number; // subtle breathe scale
  finalGlowActive?: boolean;
  dissolveProgress: number; // 0 to 1 for final fade/shrink
}

export const Logo: React.FC<LogoProps> = ({
  progress,
  ringRotation = 0,
  ringSweepProgress = 0,
  wingFlutterActive = false,
  breatheScale,
  finalGlowActive = false,
  dissolveProgress,
}) => {
  const frame = useCurrentFrame();

  const scale = progress * breatheScale * (1 - dissolveProgress) * 3;
  const opacity = progress * (1 - dissolveProgress);

  // Constants for SVG rings
  const outerRadius = 145;
  const outerCircumference = 2 * Math.PI * outerRadius; // ~911px
  const outerStrokeDashoffset = outerCircumference * (1 - ringSweepProgress);

  const innerRadius = 115;
  const innerCircumference = 2 * Math.PI * innerRadius; // ~722px
  const innerStrokeDashoffset = innerCircumference * (1 - ringSweepProgress * 1.2); // sweeps in slightly faster

  // High-frequency flutter shimmer for the wings/firefly effect
  const flutterShimmer = wingFlutterActive
    ? 0.7 + 0.3 * Math.sin(frame * 1.6) // Rapid shimmer between 0.4 and 1.0 opacity
    : 0;

  // Final glow scale pulse
  const glowPulse = finalGlowActive ? 1.0 + 0.05 * Math.sin(frame * 0.2) : 1.0;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity: opacity,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 360,
        height: 360,
        position: "relative",
      }}
    >
      {/* ==================== CORE NEON BACKGLOWS ==================== */}
      {/* Main outer soft orange glow */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232, 98, 10, 0.35) 0%, rgba(232, 98, 10, 0) 70%)",
          filter: "blur(20px)",
          opacity: progress * (1 - dissolveProgress),
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Flutter neon cyan/orange wing glow (activated during flutter frame range) */}
      {wingFlutterActive && (
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "2px solid #FF7B24",
            boxShadow: "0 0 20px #FF7B24, inset 0 0 20px #FF7B24",
            opacity: flutterShimmer * 0.45,
            filter: "blur(8px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* ==================== TECH SVG RING OVERLAYS ==================== */}
      <svg
        width={360}
        height={360}
        viewBox="0 0 360 360"
        style={{
          position: "absolute",
          transform: `rotate(${ringRotation}deg)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8620A" />
            <stop offset="100%" stopColor="#FF7B24" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Static Outer Dotted Tracking Guide */}
        <circle
          cx={180}
          cy={180}
          r={outerRadius}
          fill="none"
          stroke="rgba(232, 98, 10, 0.15)"
          strokeWidth={1.5}
          strokeDasharray="4 8"
        />

        {/* 2. Sweeping Outer Tech Ring */}
        <circle
          cx={180}
          cy={180}
          r={outerRadius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={3}
          strokeDasharray={`${outerCircumference} ${outerCircumference}`}
          strokeDashoffset={outerStrokeDashoffset}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)", // Start sweep from top center
          }}
        />

        {/* 3. Static Inner Concentric Ring Guide */}
        <circle
          cx={180}
          cy={180}
          r={innerRadius}
          fill="none"
          stroke="rgba(232, 98, 10, 0.1)"
          strokeWidth={1}
          strokeDasharray="20 10"
        />

        {/* 4. Counter-Sweeping Inner Tech Ring */}
        <circle
          cx={180}
          cy={180}
          r={innerRadius}
          fill="none"
          stroke="#FF7B24"
          strokeWidth={1.5}
          strokeDasharray={`${innerCircumference} ${innerCircumference}`}
          strokeDashoffset={innerStrokeDashoffset}
          strokeLinecap="round"
          style={{
            transformOrigin: "center",
            transform: "rotate(90deg) scaleY(-1)", // Counter-rotate sweep direction
            opacity: 0.8,
          }}
        />

        {/* 5. Delicate Crosshair Reticles for tech aesthetics */}
        {ringSweepProgress > 0.8 && (
          <>
            <line x1={180} y1={15} x2={180} y2={25} stroke="#E8620A" strokeWidth={2} opacity={0.6} />
            <line x1={180} y1={335} x2={180} y2={345} stroke="#E8620A" strokeWidth={2} opacity={0.6} />
            <line x1={15} y1={180} x2={25} y2={180} stroke="#E8620A" strokeWidth={2} opacity={0.6} />
            <line x1={335} y1={180} x2={345} y2={180} stroke="#E8620A" strokeWidth={2} opacity={0.6} />
          </>
        )}
      </svg>

      {/* ==================== CENTRAL GLASS BADGE & IMAGE ==================== */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: 60,
          background: "linear-gradient(135deg, rgba(20, 27, 38, 0.9) 0%, rgba(13, 17, 24, 0.95) 100%)",
          border: "2px solid rgba(232, 98, 10, 0.35)",
          boxShadow: `
            0 20px 45px rgba(0, 0, 0, 0.75),
            0 0 35px rgba(232, 98, 10, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, 0.15)
          `,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 3,
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(15px)",
          transform: `scale(${glowPulse})`,
        }}
      >
        {/* Shiny sweep effect across the badge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 50,
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
            transform: `skewX(-20deg) translateX(${-150 + (frame % 120) * 4}px)`,
            pointerEvents: "none",
          }}
        />

        {/* Central Logo PNG */}
        <img
          src={staticFile("asset/logo .png")}
          alt="Rebuzz Official Logo"
          style={{
            width: "72%",
            height: "72%",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))",
          }}
        />
      </div>
    </div>
  );
};
