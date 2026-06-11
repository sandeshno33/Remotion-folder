import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  AbsoluteFill,
  Sequence,
  Img,
  staticFile,
  Audio,
  OffthreadVideo,
} from "remotion";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadShareTechMono } from "@remotion/google-fonts/ShareTechMono";

// ── Load Cinematic Fonts ────────────────────────────────────────────────────
// Bebas Neue — tall condensed display font for the main title (interrogation-room stencil feel)
const { fontFamily: bebasNeue } = loadBebasNeue("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// Oswald — condensed semi-bold for taglines & CTA body text
const { fontFamily: oswald } = loadOswald("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

// Share Tech Mono — monospaced terminal font for the URL
const { fontFamily: shareTechMono } = loadShareTechMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ── Brand Colors ────────────────────────────────────────────────────────────
const BG_DARK = "#000000";
const TEXT_WHITE = "#FFFFFF";
const TEXT_MUTED = "rgba(255,255,255,0.5)";
const ACCENT_ORANGE = "#E86B3A";
const ACCENT_GRADIENT = "linear-gradient(135deg, #E86B3A 0%, #FF8D5C 100%)";

// ── Helpers ─────────────────────────────────────────────────────────────────
// const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ═══════════════════════════════════════════════════════════════════════════
// RebuzzDemoCTA — 9s (270 frames @ 30fps)
// Timeline:
//   0–30:   Background builds, ambient glow appears
//  10–40:   Logo scales in with spring
//  25–55:   "Rebuzz POS" title reveals
//  40–70:   "Everything Your Business Needs" tagline slides up
//  55–85:   Divider line draws across
// 150–180:  QR code card pops in at 5s mark with spring bounce
// 165–180:  "Scan this QR code to book free Demo" text fades in
// 180–195:  "rebuzzpos.com" URL appears
// 250–270:  Final fade out
// ═══════════════════════════════════════════════════════════════════════════

export const RebuzzDemoCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Background ambient glow ───────────────────────────────────────────
  const glowScale = interpolate(frame, [0, 135, 270], [0.85, 1.15, 0.85], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const glowRotate = interpolate(frame, [0, 270], [0, 25], {
    extrapolateRight: "clamp",
  });

  // ── Background video blur (starts blurred at 8px, gradually increases to 20px) ──────
  const backgroundBlur = interpolate(frame, [0, durationInFrames], [15, 30], {
    extrapolateRight: "clamp",
  });

  // ── Floating particles ────────────────────────────────────────────────
  const particles = [
    { x: 120, y: 280, r: 3, delay: 0, speed: 0.6 },
    { x: 900, y: 450, r: 2, delay: 5, speed: 0.4 },
    { x: 200, y: 900, r: 4, delay: 10, speed: 0.5 },
    { x: 850, y: 1200, r: 2.5, delay: 15, speed: 0.35 },
    { x: 500, y: 1600, r: 3, delay: 8, speed: 0.45 },
    { x: 80, y: 1400, r: 2, delay: 20, speed: 0.55 },
    { x: 950, y: 700, r: 3.5, delay: 3, speed: 0.3 },
    { x: 600, y: 200, r: 2, delay: 12, speed: 0.5 },
    { x: 300, y: 1100, r: 3, delay: 18, speed: 0.4 },
    { x: 750, y: 1500, r: 2, delay: 7, speed: 0.6 },
  ];

  // ── Logo ──────────────────────────────────────────────────────────────
  const logoScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 13, stiffness: 100, mass: 0.6 },
    from: 0.3,
    to: 1,
    durationInFrames: 25,
  });
  const logoOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Title "Rebuzz POS" ────────────────────────────────────────────────
  const titleScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 12, stiffness: 90, mass: 0.7 },
    from: 0.5,
    to: 1,
    durationInFrames: 25,
  });
  const titleOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Tagline "Everything Your Business Needs" ──────────────────────────
  const tagOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [40, 55], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Divider line ──────────────────────────────────────────────────────
  const dividerWidth = interpolate(frame, [55, 80], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const dividerOpacity = interpolate(frame, [55, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── QR code card (appears at 5s = frame 150) ─────────────────────────
  const qrScale = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 11, stiffness: 110, mass: 0.8 },
    from: 0.3,
    to: 1,
    durationInFrames: 30,
  });
  const qrOpacity = interpolate(frame, [150, 162], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── QR glow pulse ─────────────────────────────────────────────────────
  const qrGlow = 0.3 + 0.2 * Math.sin(frame * 0.08);

  // ── QR text ───────────────────────────────────────────────────────────
  const qrTextOpacity = interpolate(frame, [165, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const qrTextY = interpolate(frame, [165, 180], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Website URL ───────────────────────────────────────────────────────
  const urlOpacity = interpolate(frame, [180, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── URL flicker effect (cinematic terminal glitch) ────────────────────
  const urlFlicker =
    frame > 180 && frame < 200
      ? 0.7 + 0.3 * Math.sin(frame * 1.2)
      : 1;

  // ── Final fade out ────────────────────────────────────────────────────
  const finalFade = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_DARK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: oswald,
        overflow: "hidden",
      }}
    >
      {/* ── Background Video ────────────────────────────────────────── */}
      <OffthreadVideo
        src={staticFile("IMG_6415.mov")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.4,
          filter: `blur(${backgroundBlur}px)`,
        }}
        muted
      />

      {/* ── Ambient Glow Layer ──────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          width: 1600,
          height: 1600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.12) 0%, rgba(232,107,58,0.04) 40%, transparent 65%)",
          top: "5%",
          left: "50%",
          marginLeft: -800,
          transform: `rotate(${glowRotate}deg) scale(${glowScale})`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.06) 0%, transparent 50%)",
          bottom: "5%",
          right: "10%",
          pointerEvents: "none",
        }}
      />

      {/* ── Floating Particles ──────────────────────────────────────── */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
        width={1080}
        height={1920}
      >
        {particles.map((p, i) => {
          const yDrift = Math.sin((frame * p.speed + i * 30) * 0.04) * 20;
          const xDrift = Math.cos((frame * p.speed + i * 20) * 0.03) * 12;
          const pOpacity = interpolate(
            frame,
            [p.delay, p.delay + 25],
            [0, 0.4],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <circle
              key={i}
              cx={p.x + xDrift}
              cy={p.y + yDrift}
              r={p.r}
              fill={ACCENT_ORANGE}
              opacity={pOpacity}
            />
          );
        })}
      </svg>

      {/* ── Corner Accents ──────────────────────────────────────────── */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: interpolate(frame, [5, 25], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
        width={1080}
        height={1920}
      >
        {/* Top-left */}
        <line x1={60} y1={60} x2={160} y2={60} stroke={ACCENT_ORANGE} strokeWidth={3} />
        <line x1={60} y1={60} x2={60} y2={160} stroke={ACCENT_ORANGE} strokeWidth={3} />
        {/* Top-right */}
        <line x1={1020} y1={60} x2={920} y2={60} stroke={ACCENT_ORANGE} strokeWidth={3} />
        <line x1={1020} y1={60} x2={1020} y2={160} stroke={ACCENT_ORANGE} strokeWidth={3} />
        {/* Bottom-left */}
        <line x1={60} y1={1860} x2={160} y2={1860} stroke={ACCENT_ORANGE} strokeWidth={3} />
        <line x1={60} y1={1860} x2={60} y2={1760} stroke={ACCENT_ORANGE} strokeWidth={3} />
        {/* Bottom-right */}
        <line x1={1020} y1={1860} x2={920} y2={1860} stroke={ACCENT_ORANGE} strokeWidth={3} />
        <line x1={1020} y1={1860} x2={1020} y2={1760} stroke={ACCENT_ORANGE} strokeWidth={3} />
      </svg>

      {/* ── Logo ────────────────────────────────────────────────────── */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 40,
        }}
      >
        <Img
          src={staticFile("logo .png")}
          style={{
            width: 200,
            height: "auto",
            filter: "drop-shadow(0 0 50px rgba(232,107,58,0.45))",
          }}
        />
      </div>

      {/* ── Title: "REBUZZ POS" — Bebas Neue cinematic display ───────── */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: bebasNeue,
            fontSize: 140,
            fontWeight: 400,
            letterSpacing: 12,
            textTransform: "uppercase" as const,
            background: ACCENT_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.0,
            filter: "drop-shadow(0 0 30px rgba(232,107,58,0.35))",
          }}
        >
          Rebuzz POS
        </div>
      </div>

      {/* ── Tagline — Oswald condensed, uppercase, wide-tracked ──────── */}
      <div
        style={{
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontFamily: oswald,
            fontSize: 40,
            fontWeight: 300,
            color: TEXT_MUTED,
            letterSpacing: 8,
            lineHeight: 1.3,
            textTransform: "uppercase" as const,
          }}
        >
          Everything Your Business Needs
        </div>
      </div>

      {/* ── Divider Line ────────────────────────────────────────────── */}
      <div
        style={{
          width: dividerWidth,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${ACCENT_ORANGE}, transparent)`,
          opacity: dividerOpacity,
          marginBottom: 50,
        }}
      />

      {/* ── QR Code Card ────────────────────────────────────────────── */}
      <div
        style={{
          opacity: qrOpacity,
          transform: `scale(${qrScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* Glow behind QR */}
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -30,
              borderRadius: 50,
              background: `radial-gradient(circle, rgba(232,107,58,${qrGlow}) 0%, transparent 70%)`,
              filter: "blur(25px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              width: 420,
              height: 420,
              borderRadius: 30,
              background: "#0a0e17",
              border: "2px solid rgba(232,107,58,0.35)",
              boxShadow:
                "0 30px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={staticFile("free demo.png")}
              style={{
                width: "145%",
                height: "145%",
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: 0,
                filter: "brightness(1.1) contrast(1.1)",
              }}
            />
          </div>
        </div>

        {/* QR Scan Text — Oswald semi-bold, tracked */}
        <div
          style={{
            opacity: qrTextOpacity,
            transform: `translateY(${qrTextY}px)`,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          <div
            style={{
              fontFamily: oswald,
              fontSize: 36,
              fontWeight: 500,
              color: TEXT_WHITE,
              letterSpacing: 4,
              lineHeight: 1.4,
              textTransform: "uppercase" as const,
            }}
          >
            Scan this QR Code to{" "}
            <span
              style={{
                background: ACCENT_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}
            >
              Book Free Demo
            </span>
          </div>
        </div>
      </div>

      {/* ── Website URL — Share Tech Mono, terminal aesthetic ─────────── */}
      <div
        style={{
          opacity: urlOpacity * urlFlicker,
          marginTop: 50,
        }}
      >
        <div
          style={{
            fontFamily: shareTechMono,
            fontSize: 44,
            fontWeight: 400,
            color: ACCENT_ORANGE,
            letterSpacing: 6,
            textAlign: "center",
            textTransform: "lowercase" as const,
            textShadow: `0 0 20px rgba(232,107,58,0.5), 0 0 40px rgba(232,107,58,0.2)`,
          }}
        >
          rebuzzpos.com
        </div>
      </div>

      {/* ── Scanline Texture Overlay ────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 3px
          )`,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      {/* ── Final Fade Out ──────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000",
          opacity: finalFade,
          pointerEvents: "none",
        }}
      />

      {/* ── SFX ─────────────────────────────────────────────────────── */}
      <Sequence from={25} durationInFrames={30} layout="none">
        <Audio src={staticFile("ding.wav")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};
