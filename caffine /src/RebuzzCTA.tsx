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
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

// ── Load Fonts ──────────────────────────────────────────────────────────────
const { fontFamily: inter } = loadInter("normal", {
  weights: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

// ── Brand Colors ────────────────────────────────────────────────────────────
const BG_DARK = "#000000";
const TEXT_WHITE = "#FFFFFF";
const TEXT_MUTED = "rgba(255,255,255,0.5)";
const ACCENT_ORANGE = "#E86B3A";
const ACCENT_GRADIENT =
  "linear-gradient(135deg, #E86B3A 0%, #FF8D5C 100%)";
// const FEATURE_BG = "rgba(255,255,255,0.08)";
// const FEATURE_BORDER = "rgba(255,255,255,0.12)";

// ═══════════════════════════════════════════════════════════════════════════
// Scene 1: Happy POS Client Intro (2x Bolder Layout)
// ═══════════════════════════════════════════════════════════════════════════
const SceneClient: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo spring scale entrance
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.5 },
    from: 0.4,
    to: 1,
    durationInFrames: 25,
  });
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Client tagline tag slide + fade
  const tagOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [8, 22], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Question slide + fade
  const questionOpacity = interpolate(frame, [18, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const questionY = interpolate(frame, [18, 35], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Glow pulse animation
  const glowScale = interpolate(frame, [0, 60], [0.9, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_DARK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: inter,
        padding: 120,
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.12) 0%, rgba(232,107,58,0.04) 45%, transparent 70%)",
          transform: `scale(${glowScale})`,
          top: "10%",
          left: "50%",
          marginLeft: -700,
        }}
      />

      {/* Client uppercase tag (2x size & spacing) */}
      <div
        style={{
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          marginBottom: 70,
        }}
      >
        <div
          style={{
            fontSize: 50,
            fontWeight: 600,
            color: ACCENT_ORANGE,
            letterSpacing: 9.6,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          A happy POS client
        </div>
      </div>

      {/* Client Logo circular card (2x size & spacing) */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 110,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          border: "2px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 40px 100px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(20px)",
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("caffine logo.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Big Question tag (2x size) */}
      <div
        style={{
          opacity: questionOpacity,
          transform: `translateY(${questionY}px)`,
          maxWidth: 960,
        }}
      >
        <div
          style={{
            fontSize: 70,
            fontWeight: 700,
            color: TEXT_WHITE,
            textAlign: "center",
            letterSpacing: -2.4,
            lineHeight: 1.2,
          }}
        >
          Are you using POS
          <br />
          at your business?
        </div>
      </div>

      {/* SFX */}
      <Sequence from={0} durationInFrames={15} layout="none">
        <Audio src={staticFile("whoosh.wav")} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Scene 2: Rebuzz Brand CTA Page (2x Bolder Layout)
// ═══════════════════════════════════════════════════════════════════════════
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Logo ────────────────────────────────────────────────────────────────
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.5 },
    from: 0.4,
    to: 1,
    durationInFrames: 20,
  });
  const logoOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Tagline spring ─────────────────────────────────────────────────────
  const tagScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 12, stiffness: 90, mass: 0.7 },
    from: 0.6,
    to: 1,
    durationInFrames: 20,
  });
  const tagOpacity = interpolate(frame, [5, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Sub CTA ────────────────────────────────────────────────────────────
  const ctaOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [20, 35], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Store badges ───────────────────────────────────────────────────────
  const storeOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const storeY = interpolate(frame, [30, 45], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Website URL ────────────────────────────────────────────────────────
  const urlOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Ambient glow animation ─────────────────────────────────────────────
  const glowRotate = interpolate(frame, [0, 150], [0, 30], {
    extrapolateRight: "clamp",
  });
  const glowScale = interpolate(frame, [0, 75, 150], [0.9, 1.1, 0.9], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_DARK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: inter,
      }}
    >
      {/* Dual ambient glow (2x size) */}
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.1) 0%, transparent 50%)",
          top: "20%",
          left: "10%",
          transform: `rotate(${glowRotate}deg) scale(${glowScale})`,
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
          bottom: "10%",
          right: "15%",
        }}
      />

      {/* Logo (2x size & spacing) */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 48,
        }}
      >
        <Img
          src={staticFile("logo .png")}
          style={{
            width: 240,
            height: "auto",
            filter: "drop-shadow(0 0 60px rgba(232,107,58,0.4))",
          }}
        />
      </div>

      {/* Main tagline (2x size & spacing) */}
      <div
        style={{
          opacity: tagOpacity,
          transform: `scale(${tagScale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -3,
            background: ACCENT_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.15,
          }}
        >
          Click. Buzz. Sold.
        </div>
      </div>

      {/* Subtitle (2x size & spacing) */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          marginTop: 40,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 400,
            color: TEXT_MUTED,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Simplified POS for every business.
        </div>
      </div>

      {/* QR Code Section */}
      <div
        style={{
          opacity: storeOpacity,
          transform: `translateY(${storeY}px)`,
          marginTop: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 280,
            height: 280,
            borderRadius: 36,
            background: "rgba(255, 255, 255, 0.05)",
            border: "2px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(15px)",
            padding: 20,
          }}
        >
          <Img
            src={staticFile("app-link-qr.png")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: TEXT_WHITE,
            letterSpacing: 0.5,
            textAlign: "center",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Scan this QR to download now
        </div>
      </div>



      {/* Website (2x size & spacing) */}
      <div
        style={{
          opacity: urlOpacity,
          marginTop: 60,
        }}
      >
        <div
          style={{
            fontSize: 50,
            fontWeight: 400,
            color: ACCENT_ORANGE,
            letterSpacing: 2,
          }}
        >
          rebuzzpos.com
        </div>
      </div>

      {/* SFX */}
      <Sequence from={0} durationInFrames={15} layout="none">
        <Audio src={staticFile("whoosh.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={25} durationInFrames={30} layout="none">
        <Audio src={staticFile("ding.wav")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// RebuzzCTA Main Composition with TransitionSeries
// ═══════════════════════════════════════════════════════════════════════════
export const RebuzzCTA: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK }}>
      <TransitionSeries>
        {/* Scene 1: Client Intro (frames 0–65) */}
        <TransitionSeries.Sequence durationInFrames={65}>
          <SceneClient />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 2: Rebuzz CTA (frames ~55–180) */}
        <TransitionSeries.Sequence durationInFrames={125}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
