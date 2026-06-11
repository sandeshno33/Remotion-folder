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
  width: 52,
  height: 52,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: TEXT_WHITE,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IconBolt = () => (
  <svg {...iconProps}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconChart = () => (
  <svg {...iconProps}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconShield = () => (
  <svg {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconGlobe = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ── Stats data ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "10x", label: "Faster Checkout" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const PILLARS = [
  { icon: <IconBolt />, label: "Lightning Fast" },
  { icon: <IconChart />, label: "Smart Analytics" },
  { icon: <IconShield />, label: "Bank-Grade Security" },
  { icon: <IconGlobe />, label: "Works Anywhere" },
];

// ═══════════════════════════════════════════════════════════════════════════
// Scene 1 — Logo Impact (frames 0–70): Logo + Title blast in
// ═══════════════════════════════════════════════════════════════════════════
const SceneLogoImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLandscape = width > height;
  const isSquare = width === height;

  // Sizing tokens based on aspect ratios
  const titleFontSize = isLandscape ? 140 : isSquare ? 110 : 120;
  const taglineFontSize = isLandscape ? 40 : isSquare ? 32 : 38;
  const logoWidth = isLandscape ? 280 : isSquare ? 240 : 300;
  const accentLineMaxWidth = isLandscape ? 600 : isSquare ? 450 : 500;

  // Radial flash
  const flashOpacity = interpolate(frame, [0, 8, 20], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo scale-in spring
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
    from: 0,
    to: 1,
    durationInFrames: 20,
  });
  const logoOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title slide-up
  const titleY = interpolate(frame, [8, 28], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline
  const tagOpacity = interpolate(frame, [22, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [22, 35], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Animated accent line under the tagline
  const lineWidth = interpolate(frame, [30, 50], [0, accentLineMaxWidth], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Ambient glow breathing
  const glowScale = interpolate(frame, [0, 70], [0.7, 1.3], {
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
      {/* Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(232,107,58,0.8) 0%, transparent 60%)",
          opacity: flashOpacity,
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: Math.min(width, height) * 1.1,
          height: Math.min(width, height) * 1.1,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.18) 0%, rgba(232,107,58,0.05) 40%, transparent 70%)",
          transform: `scale(${glowScale})`,
          top: "20%",
          left: "50%",
          marginLeft: -Math.min(width, height) * 0.55,
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: isLandscape ? 30 : 40,
        }}
      >
        <Img
          src={staticFile("logo .png")}
          style={{
            width: logoWidth,
            height: "auto",
            filter: "drop-shadow(0 0 80px rgba(232,107,58,0.6))",
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
            fontSize: titleFontSize,
            fontWeight: 900,
            letterSpacing: -4,
            background: ACCENT_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          {isLandscape ? (
            "Rebuzz POS"
          ) : (
            <>
              Rebuzz
              <br />
              POS
            </>
          )}
        </div>
      </div>

      {/* Accent line */}
      <div
        style={{
          width: lineWidth,
          height: 4,
          borderRadius: 2,
          background: ACCENT_GRADIENT,
          marginTop: isLandscape ? 20 : 30,
          marginBottom: isLandscape ? 20 : 30,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
        }}
      >
        <div
          style={{
            fontSize: taglineFontSize,
            fontWeight: 400,
            color: TEXT_MUTED,
            letterSpacing: isLandscape ? 10 : 8,
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
// Scene 2 — Pain Point + Stat Blast (frames ~60–140)
// ═══════════════════════════════════════════════════════════════════════════
const ScenePainStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLandscape = width > height;
  const isSquare = width === height;

  // Responsive styling variables
  const headlineFontSize = isLandscape ? 90 : isSquare ? 72 : 80;
  const subFontSize = isLandscape ? 36 : isSquare ? 30 : 34;
  const cardMaxWidth = isLandscape ? 320 : isSquare ? 260 : 280;
  const cardPadding = isLandscape ? "44px 50px" : isSquare ? "36px 40px" : "48px 50px";
  const contentGap = isLandscape ? 60 : 80;

  // Headline
  const headOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headY = interpolate(frame, [0, 15], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Sub-headline
  const subOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        padding: isLandscape ? "40px 90px" : "90px",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: Math.min(width, height) * 0.9,
          height: Math.min(width, height) * 0.9,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.1) 0%, transparent 55%)",
          top: "5%",
          left: "-10%",
        }}
      />

      {/* Headline */}
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          textAlign: "center",
          marginBottom: 15,
        }}
      >
        <div
          style={{
            fontSize: headlineFontSize,
            fontWeight: 800,
            color: TEXT_WHITE,
            letterSpacing: -2,
            lineHeight: 1.15,
          }}
        >
          {isLandscape ? (
            <>
              Still using{" "}
              <span
                style={{
                  background: ACCENT_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                old registers?
              </span>
            </>
          ) : (
            <>
              Still using
              <br />
              <span
                style={{
                  background: ACCENT_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                old registers?
              </span>
            </>
          )}
        </div>
      </div>

      {/* Sub-headline */}
      <div
        style={{
          opacity: subOpacity,
          marginBottom: contentGap,
        }}
      >
        <div
          style={{
            fontSize: subFontSize,
            fontWeight: 400,
            color: TEXT_MUTED,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          It's time to upgrade.
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: isLandscape ? 40 : 30,
          justifyContent: "center",
          width: "100%",
          maxWidth: isLandscape ? 1200 : 900,
        }}
      >
        {STATS.map((stat, i) => {
          const delay = 18 + i * 12;
          const statScale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 120, mass: 0.5 },
            from: 0,
            to: 1,
            durationInFrames: 18,
          });
          const statOpacity = interpolate(
            frame,
            [delay, delay + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={stat.label}
              style={{
                opacity: statOpacity,
                transform: `scale(${statScale})`,
                background: FEATURE_BG,
                border: `1px solid ${FEATURE_BORDER}`,
                borderRadius: 32,
                padding: cardPadding,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                backdropFilter: "blur(10px)",
                flex: 1,
                maxWidth: cardMaxWidth,
              }}
            >
              <span
                style={{
                  fontSize: isLandscape ? 76 : isSquare ? 58 : 72,
                  fontWeight: 900,
                  background: ACCENT_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: -2,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: isLandscape ? 26 : isSquare ? 20 : 26,
                  fontWeight: 500,
                  color: TEXT_MUTED,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Scene 3 — Feature Pillars (frames ~130–210)
// ═══════════════════════════════════════════════════════════════════════════
const ScenePillars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLandscape = width > height;
  const isSquare = width === height;

  // Responsive styling variables
  const labelFontSize = isLandscape ? 32 : isSquare ? 26 : 32;
  const headingFontSize = isLandscape ? 80 : isSquare ? 60 : 76;
  const cardWidth = isLandscape ? 360 : isSquare ? 320 : 400;
  const cardPadding = isLandscape ? "30px 30px" : isSquare ? "30px 30px" : "40px 40px";

  // Title
  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 12], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const renderLeftHeader = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isLandscape ? "flex-start" : "center",
        marginBottom: isLandscape ? 0 : isSquare ? 50 : 80,
        textAlign: isLandscape ? "left" : "center",
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 16,
          fontSize: labelFontSize,
          fontWeight: 600,
          color: ACCENT_ORANGE,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        Why Rebuzz?
      </div>
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: headingFontSize,
            fontWeight: 800,
            color: TEXT_WHITE,
            letterSpacing: -2,
            lineHeight: 1.15,
          }}
        >
          Built for
          <br />
          <span
            style={{
              background: ACCENT_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            modern business
          </span>
        </div>
      </div>
    </div>
  );

  const renderPillarsList = (gapSize: number) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: gapSize,
        justifyContent: "center",
        maxWidth: isLandscape ? 780 : 900,
      }}
    >
      {PILLARS.map((pillar, i) => {
        const delay = 8 + i * 10;
        const cardScale = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 14, stiffness: 120, mass: 0.5 },
          from: 0,
          to: 1,
          durationInFrames: 16,
        });
        const cardOpacity = interpolate(
          frame,
          [delay, delay + 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={pillar.label}
            style={{
              opacity: cardOpacity,
              transform: `scale(${cardScale})`,
              background: FEATURE_BG,
              border: `1px solid ${FEATURE_BORDER}`,
              borderRadius: 28,
              padding: cardPadding,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              backdropFilter: "blur(12px)",
              width: cardWidth,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(232,107,58,0.2) 0%, rgba(232,107,58,0.05) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid rgba(232,107,58,0.25)`,
              }}
            >
              {pillar.icon}
            </div>
            <span
              style={{
                fontSize: isLandscape ? 28 : isSquare ? 26 : 30,
                fontWeight: 600,
                color: TEXT_WHITE,
                letterSpacing: 0.5,
                textAlign: "center",
              }}
            >
              {pillar.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_DARK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: inter,
        padding: isLandscape ? "0 100px" : "80px",
      }}
    >
      {/* Ambient glows */}
      <div
        style={{
          position: "absolute",
          width: Math.min(width, height) * 0.8,
          height: Math.min(width, height) * 0.8,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.14) 0%, transparent 60%)",
          top: "10%",
          right: "-5%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: Math.min(width, height) * 0.6,
          height: Math.min(width, height) * 0.6,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,141,92,0.08) 0%, transparent 60%)",
          bottom: "10%",
          left: "-5%",
        }}
      />

      {isLandscape ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 80,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {renderLeftHeader()}
          {renderPillarsList(24)}
        </div>
      ) : (
        <>
          {renderLeftHeader()}
          {renderPillarsList(28)}
        </>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Scene 4 — CTA Finale (frames ~200–300)
// ═══════════════════════════════════════════════════════════════════════════
const SceneFinale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLandscape = width > height;
  const isSquare = width === height;

  // Responsive styling variables
  const ctaTitleFontSize = isLandscape ? 90 : isSquare ? 80 : 100;
  const ctaSubFontSize = isLandscape ? 32 : isSquare ? 28 : 36;
  const logoW = isLandscape ? 180 : isSquare ? 160 : 220;
  const qrBoxSize = isLandscape ? 190 : isSquare ? 180 : 220;
  const buttonPadding = isLandscape ? "18px 50px" : isSquare ? "16px 45px" : "22px 70px";
  const buttonFontSize = isLandscape ? 28 : isSquare ? 26 : 34;
  const webFontSize = isLandscape ? 40 : isSquare ? 36 : 44;

  // Logo
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 90, mass: 0.5 },
    from: 0.3,
    to: 1,
    durationInFrames: 20,
  });
  const logoOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Click. Buzz. Sold."
  const tagScale = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.6 },
    from: 0.5,
    to: 1,
    durationInFrames: 20,
  });
  const tagOpacity = interpolate(frame, [8, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // QR Code
  const qrOpacity = interpolate(frame, [22, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const qrY = interpolate(frame, [22, 38], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // URL
  const urlOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Download Now" badge
  const badgeOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeScale = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0.6,
    to: 1,
    durationInFrames: 15,
  });

  // Ambient glow rotation
  const glowRot = interpolate(frame, [0, 100], [0, 20], {
    extrapolateRight: "clamp",
  });
  const glowPulse = interpolate(frame, [0, 50, 100], [0.9, 1.15, 0.9], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  const renderLeftCTA = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isLandscape ? "flex-start" : "center",
        textAlign: isLandscape ? "left" : "center",
        gap: 16,
      }}
    >
      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 10,
        }}
      >
        <Img
          src={staticFile("logo .png")}
          style={{
            width: logoW,
            height: "auto",
            filter: "drop-shadow(0 0 60px rgba(232,107,58,0.5))",
          }}
        />
      </div>

      {/* Main CTA Tagline */}
      <div
        style={{
          opacity: tagOpacity,
          transform: `scale(${tagScale})`,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            fontSize: ctaTitleFontSize,
            fontWeight: 900,
            letterSpacing: -3,
            background: ACCENT_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
          }}
        >
          {isLandscape ? (
            "Click. Buzz. Sold."
          ) : (
            <>
              Click. Buzz.
              <br />
              Sold.
            </>
          )}
        </div>
      </div>

      {/* Subtitle */}
      <div style={{ opacity: tagOpacity, marginBottom: isLandscape ? 20 : 30 }}>
        <div
          style={{
            fontSize: ctaSubFontSize,
            fontWeight: 400,
            color: TEXT_MUTED,
            letterSpacing: 1,
          }}
        >
          Simplified POS for every business.
        </div>
      </div>

      {/* Website (only left aligned in landscape) */}
      {isLandscape && (
        <div style={{ opacity: urlOpacity }}>
          <div
            style={{
              fontSize: webFontSize,
              fontWeight: 400,
              color: ACCENT_ORANGE,
              letterSpacing: 2,
            }}
          >
            rebuzzpos.com
          </div>
        </div>
      )}
    </div>
  );

  const renderRightCTA = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* QR Code */}
      <div
        style={{
          opacity: qrOpacity,
          transform: `translateY(${qrY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: qrBoxSize,
            height: qrBoxSize,
            borderRadius: 28,
            background: "rgba(255,255,255,0.05)",
            border: "2px solid rgba(255,255,255,0.12)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
            backdropFilter: "blur(15px)",
            padding: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("app-link-qr.png")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 16,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: TEXT_WHITE,
            opacity: 0.8,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Scan to download
        </div>
      </div>

      {/* Download Now button badge */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          marginTop: 10,
        }}
      >
        <div
          style={{
            background: ACCENT_GRADIENT,
            borderRadius: 60,
            padding: buttonPadding,
            fontSize: buttonFontSize,
            fontWeight: 700,
            color: TEXT_WHITE,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            boxShadow: "0 12px 40px rgba(232,107,58,0.35)",
            textAlign: "center",
          }}
        >
          Download Now
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_DARK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: inter,
        padding: isLandscape ? "0 100px" : "60px",
      }}
    >
      {/* Dual ambient glows */}
      <div
        style={{
          position: "absolute",
          width: Math.min(width, height) * 1.3,
          height: Math.min(width, height) * 1.3,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,107,58,0.12) 0%, transparent 50%)",
          top: "15%",
          left: "5%",
          transform: `rotate(${glowRot}deg) scale(${glowPulse})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: Math.min(width, height) * 0.9,
          height: Math.min(width, height) * 0.9,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,141,92,0.06) 0%, transparent 50%)",
          bottom: "5%",
          right: "5%",
        }}
      />

      {isLandscape ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 120,
            width: "100%",
          }}
        >
          {renderLeftCTA()}
          {renderRightCTA()}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isSquare ? 24 : 36,
          }}
        >
          {renderLeftCTA()}
          {renderRightCTA()}

          {/* Website URL (below QR for portrait and square) */}
          <div style={{ opacity: urlOpacity, marginTop: isSquare ? 10 : 20 }}>
            <div
              style={{
                fontSize: webFontSize,
                fontWeight: 400,
                color: ACCENT_ORANGE,
                letterSpacing: 2,
              }}
            >
              rebuzzpos.com
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Main Composition — 11.6 seconds (348 frames @ 30fps)
// ═══════════════════════════════════════════════════════════════════════════
export const RebuzzPOSPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK }}>
      <TransitionSeries>
        {/* Scene 1: Logo Impact (0–87) */}
        <TransitionSeries.Sequence durationInFrames={87}>
          <SceneLogoImpact />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 2: Pain Point + Stats (~77–169) */}
        <TransitionSeries.Sequence durationInFrames={92}>
          <ScenePainStats />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 3: Feature Pillars (~159–251) */}
        <TransitionSeries.Sequence durationInFrames={92}>
          <ScenePillars />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 4: CTA Finale (~241–348) */}
        <TransitionSeries.Sequence durationInFrames={107}>
          <SceneFinale />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Background Music */}
      <Audio src={staticFile("bg.mp3")} volume={0.3} startFrom={210} />

      {/* Voiceover */}
      <Audio src={staticFile("vo.wav")} volume={1.0} />

      {/* Global SFX */}
      <Sequence from={0} durationInFrames={15} layout="none">
        <Audio src={staticFile("whoosh.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={77} durationInFrames={15} layout="none">
        <Audio src={staticFile("whoosh.wav")} volume={0.25} />
      </Sequence>
      <Sequence from={159} durationInFrames={15} layout="none">
        <Audio src={staticFile("whoosh.wav")} volume={0.25} />
      </Sequence>
      <Sequence from={241} durationInFrames={15} layout="none">
        <Audio src={staticFile("whoosh.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={276} durationInFrames={30} layout="none">
        <Audio src={staticFile("ding.wav")} volume={0.4} />
      </Sequence>

      {/* Pop SFX for stat cards */}
      {STATS.map((_, i) => (
        <Sequence key={`pop-stat-${i}`} from={95 + i * 12} durationInFrames={20} layout="none">
          <Audio src={staticFile("pop.mp3")} volume={0.35} />
        </Sequence>
      ))}

      {/* Pop SFX for pillar cards */}
      {PILLARS.map((_, i) => (
        <Sequence key={`pop-pillar-${i}`} from={167 + i * 10} durationInFrames={20} layout="none">
          <Audio src={staticFile("pop.mp3")} volume={0.3} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
