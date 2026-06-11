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
const ACCENT_GRADIENT = "linear-gradient(135deg, #E86B3A 0%, #FF8D5C 100%)";
const FEATURE_BG = "rgba(255,255,255,0.08)";
const FEATURE_BORDER = "rgba(255,255,255,0.12)";

// ── SVG Icons ───────────────────────────────────────────────────────────────
const iconProps = {
  width: 44,
  height: 44,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: TEXT_WHITE,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IconDashboard = () => (
  <svg {...iconProps}>
    <rect x="3" y="13" width="4" height="8" rx="1" />
    <rect x="10" y="8" width="4" height="13" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);

const IconPayment = () => (
  <svg {...iconProps}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="6" y1="15" x2="10" y2="15" />
    <line x1="14" y1="15" x2="16" y2="15" />
  </svg>
);

const IconStock = () => (
  <svg {...iconProps}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconCustomer = () => (
  <svg {...iconProps}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconCloud = () => (
  <svg {...iconProps}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const IconMobile = () => (
  <svg {...iconProps}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

// ── Features ────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <IconDashboard />, label: "Real-time Dashboard" },
  { icon: <IconPayment />, label: "Multi-Payment" },
  { icon: <IconStock />, label: "Stock Tracking" },
  { icon: <IconCustomer />, label: "Customer CRM" },
  { icon: <IconCloud />, label: "Cloud Sync" },
  { icon: <IconMobile />, label: "Cross-Platform" },
];

// ═══════════════════════════════════════════════════════════════════════════
// Scene 1 — Hero intro: Logo + tagline
// ═══════════════════════════════════════════════════════════════════════════
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale spring
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.6 },
    from: 0.3,
    to: 1,
    durationInFrames: 25,
  });

  // Logo opacity
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title slide-up + fade
  const titleY = interpolate(frame, [10, 30], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle fade
  const subOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [25, 40], [45, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Ambient glow pulse
  const glowScale = interpolate(frame, [0, 60], [0.8, 1.2], {
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
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.15) 0%, rgba(232,107,58,0.06) 40%, transparent 70%)",
          transform: `scale(${glowScale})`,
          top: "25%",
          left: "50%",
          marginLeft: -450,
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 45,
        }}
      >
        <Img
          src={staticFile("logo .png")}
          style={{
            width: 270,
            height: "auto",
            filter: "drop-shadow(0 0 60px rgba(232,107,58,0.45))",
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: -3,
            background: ACCENT_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Rebuzz POS
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          marginTop: 24,
        }}
      >
        <div
          style={{
            fontSize: 33,
            fontWeight: 400,
            color: TEXT_MUTED,
            letterSpacing: 6,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          The Future of POS
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Scene 2 — Features showcase
// ═══════════════════════════════════════════════════════════════════════════
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline
  const headOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headY = interpolate(frame, [0, 15], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
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
        padding: 90,
      }}
    >
      {/* Ambient glow — orange */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.12) 0%, transparent 60%)",
          top: "15%",
          right: "-5%",
        }}
      />

      {/* Headline */}
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          marginBottom: 90,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: ACCENT_ORANGE,
            letterSpacing: 5.4,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          All-in-One Solution
        </div>
        <div
          style={{
            fontSize: 86,
            fontWeight: 700,
            color: TEXT_WHITE,
            letterSpacing: -1.8,
            lineHeight: 1.2,
          }}
        >
          Everything your
          <br />
          business needs.
        </div>
      </div>

      {/* POP SFX for each element as they appear */}
      {FEATURES.map((_, i) => {
        const stagger = 8 + i * 18;
        return (
          <Sequence key={`sfx-${i}`} from={stagger} durationInFrames={30} layout="none">
            <Audio src={staticFile("pop.mp3")} volume={0.4} />
          </Sequence>
        );
      })}

      {/* Feature grid (2 columns × 3 rows) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          justifyContent: "center",
          maxWidth: 1260,
        }}
      >
        {FEATURES.map((feat, i) => {
          const stagger = 8 + i * 18;
          const pillScale = spring({
            frame: Math.max(0, frame - stagger),
            fps,
            config: { damping: 14, stiffness: 120, mass: 0.5 },
            from: 0,
            to: 1,
            durationInFrames: 18,
          });
          const pillOpacity = interpolate(
            frame,
            [stagger, stagger + 10],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <div
              key={feat.label}
              style={{
                opacity: pillOpacity,
                transform: `scale(${pillScale})`,
                background: FEATURE_BG,
                border: `1px solid ${FEATURE_BORDER}`,
                borderRadius: 28,
                padding: "32px 50px",
                display: "flex",
                alignItems: "center",
                gap: 22,
                backdropFilter: "blur(10px)",
                width: 558,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 50, height: 50 }}>{feat.icon}</span>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  color: TEXT_WHITE,
                  letterSpacing: 0.54,
                }}
              >
                {feat.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};



// ═══════════════════════════════════════════════════════════════════════════
// Main Composition — TransitionSeries (Hero + Features only)
// ═══════════════════════════════════════════════════════════════════════════
export const RebuzzPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK }}>
      <TransitionSeries>
        {/* Scene 1: Hero (frames 0–55) */}
        <TransitionSeries.Sequence durationInFrames={55}>
          <SceneHero />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 2: Features (frames ~46–205) — extended for 0.6s delay */}
        <TransitionSeries.Sequence durationInFrames={160}>
          <SceneFeatures />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* SFX */}
      <Sequence from={0} durationInFrames={15} layout="none">
        <Audio src={staticFile("whoosh.wav")} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};
