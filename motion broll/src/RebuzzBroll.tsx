import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, Sequence, staticFile } from "remotion";

// ============================================================
// REBUZZ ORDERING — B-ROLL COMPOSITION
// Script: "Don't stress, save your time, and shop for what
//          you need from your phone."
// 1080x1920 @ 30fps | Duration: ~8 seconds (240 frames)
// Aesthetic: Dark Cyberpunk / Tech-Corporate
// ============================================================

const W = 1080;
const H = 1920;
const FPS = 30;

// ─── Brand Colors ────────────────────────────────────────────
const C = {
  bg: "#0D1118",
  bgCard: "#141B26",
  orange: "#E8620A",
  orangeGlow: "#FF7B24",
  navy: "#1A2F5A",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.55)",
  grid: "rgba(232,98,10,0.07)",
};

// ─── Easing helpers ──────────────────────────────────────────
const spr = (frame: number, delay: number, fps: number, cfg = {}) =>
  spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120, mass: 0.8, ...cfg } });

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const fadeIn = (frame: number, start: number, dur = 10) =>
  clamp01((frame - start) / dur);

// ─── Scene timing ────────────────────────────────────────────
// 0–30:   Dark BG builds in, grid flickers on
// 30–70:  Stress icon + word "Don't stress" slams in
// 70–110: Clock icon + "save your time" sweeps in
// 110–155: Cart icon + "shop for what you need" reveals
// 155–210: Phone mockup with app UI pops in from below
// 210–240: Final glow + hold + fade

// ─── Grid Background ─────────────────────────────────────────
const GridBG: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const lines = 18;
  const spacing = H / lines;
  const vLines = 10;
  const vSpacing = W / vLines;

  return (
    <svg
      style={{ position: "absolute", inset: 0, opacity }}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="55%" r="65%">
          <stop offset="0%" stopColor="#1A2030" />
          <stop offset="100%" stopColor="#0D1118" />
        </radialGradient>
        <radialGradient id="glowCenter" cx="50%" cy="60%" r="45%">
          <stop offset="0%" stopColor="rgba(232,98,10,0.12)" />
          <stop offset="100%" stopColor="rgba(232,98,10,0)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bgGrad)" />
      <rect width={W} height={H} fill="url(#glowCenter)" />
      {/* Horizontal grid lines */}
      {Array.from({ length: lines + 1 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={i * spacing}
          x2={W}
          y2={i * spacing}
          stroke={C.grid}
          strokeWidth={1}
        />
      ))}
      {/* Vertical grid lines */}
      {Array.from({ length: vLines + 1 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * vSpacing}
          y1={0}
          x2={i * vSpacing}
          y2={H}
          stroke={C.grid}
          strokeWidth={1}
        />
      ))}
    </svg>
  );
};

// ─── Floating Particles ──────────────────────────────────────
const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = [
    { x: 80, y: 300, size: 22, shape: "hex", delay: 5, speed: 0.4, rot: 30 },
    { x: 950, y: 420, size: 16, shape: "tri", delay: 12, speed: 0.3, rot: 15 },
    { x: 140, y: 750, size: 28, shape: "hex", delay: 8, speed: 0.5, rot: 60 },
    { x: 980, y: 900, size: 18, shape: "tri", delay: 20, speed: 0.35, rot: 90 },
    { x: 60, y: 1150, size: 24, shape: "hex", delay: 3, speed: 0.45, rot: 45 },
    { x: 990, y: 1300, size: 14, shape: "tri", delay: 15, speed: 0.28, rot: 10 },
    { x: 200, y: 1550, size: 20, shape: "hex", delay: 25, speed: 0.38, rot: 70 },
    { x: 870, y: 1700, size: 26, shape: "tri", delay: 10, speed: 0.5, rot: 20 },
  ];

  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={W} height={H}>
      {particles.map((p, i) => {
        const yDrift = Math.sin((frame * p.speed + i * 40) * 0.05) * 18;
        const rot = p.rot + frame * p.speed * 0.5;
        const opacity = interpolate(frame, [p.delay, p.delay + 20], [0, 0.6], { extrapolateRight: "clamp" });

        if (p.shape === "hex") {
          const r = p.size;
          const pts = Array.from({ length: 6 })
            .map((_, k) => {
              const a = (Math.PI / 3) * k - Math.PI / 6;
              return `${r * Math.cos(a)},${r * Math.sin(a)}`;
            })
            .join(" ");
          return (
            <g key={i} transform={`translate(${p.x},${p.y + yDrift}) rotate(${rot})`} opacity={opacity}>
              <polygon points={pts} fill="none" stroke={C.orange} strokeWidth={1.5} />
            </g>
          );
        } else {
          const r = p.size;
          const pts = `0,${-r} ${r * 0.866},${r * 0.5} ${-r * 0.866},${r * 0.5}`;
          return (
            <g key={i} transform={`translate(${p.x},${p.y + yDrift}) rotate(${rot})`} opacity={opacity}>
              <polygon points={pts} fill="none" stroke={C.orangeGlow} strokeWidth={1.5} />
            </g>
          );
        }
      })}
    </svg>
  );
};

// ─── Corner Brackets ─────────────────────────────────────────
const CornerBrackets: React.FC<{ frame: number }> = ({ frame }) => {
  const scale = spr(frame, 0, FPS);
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const size = 70;
  const thick = 4;
  const margin = 48;
  const color = C.orange;

  // Inward offset that springs down to 0:
  const offset = (1 - scale) * 100;

  const corners = [
    { x: margin, y: margin, rx: 1, ry: 1 },
    { x: W - margin, y: margin, rx: -1, ry: 1 },
    { x: margin, y: H - margin, rx: 1, ry: -1 },
    { x: W - margin, y: H - margin, rx: -1, ry: -1 },
  ];

  return (
    <svg style={{ position: "absolute", inset: 0, opacity }} width={W} height={H}>
      {corners.map((c, i) => (
        <g
          key={i}
          transform={`translate(${c.x + offset * -c.rx},${c.y + offset * -c.ry}) scale(${scale * c.rx},${scale * c.ry})`}
        >
          <rect x={0} y={0} width={size} height={thick} fill={color} rx={2} />
          <rect x={0} y={0} width={thick} height={size} fill={color} rx={2} />
        </g>
      ))}
    </svg>
  );
};

// ─── Icon: Stress (zigzag lightning) ─────────────────────────
const StressIcon: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width={90} height={90} viewBox="0 0 90 90" style={{ opacity: progress }}>
    <circle cx={45} cy={45} r={42} fill="rgba(232,98,10,0.12)" stroke={C.orange} strokeWidth={2} />
    {/* Brain-stress zigzag */}
    <path
      d="M50 18 L32 48 L46 48 L38 72 L62 40 L48 40 Z"
      fill={C.orange}
      opacity={0.9}
    />
  </svg>
);

// ─── Icon: Time (clock) ───────────────────────────────────────
const TimeIcon: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const handAngle = (frame * 6) % 360;
  return (
    <svg width={90} height={90} viewBox="0 0 90 90" style={{ opacity: progress }}>
      <circle cx={45} cy={45} r={42} fill="rgba(232,98,10,0.12)" stroke={C.orange} strokeWidth={2} />
      <circle cx={45} cy={45} r={30} fill="none" stroke={C.orange} strokeWidth={1.5} />
      {/* Hour ticks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
        <line
          key={i}
          x1={45 + 26 * Math.cos((a - 90) * Math.PI / 180)}
          y1={45 + 26 * Math.sin((a - 90) * Math.PI / 180)}
          x2={45 + (i % 3 === 0 ? 20 : 23) * Math.cos((a - 90) * Math.PI / 180)}
          y2={45 + (i % 3 === 0 ? 20 : 23) * Math.sin((a - 90) * Math.PI / 180)}
          stroke={C.orange}
          strokeWidth={i % 3 === 0 ? 2 : 1}
        />
      ))}
      {/* Minute hand */}
      <line
        x1={45} y1={45}
        x2={45 + 22 * Math.cos((handAngle - 90) * Math.PI / 180)}
        y2={45 + 22 * Math.sin((handAngle - 90) * Math.PI / 180)}
        stroke={C.white} strokeWidth={2.5} strokeLinecap="round"
      />
      {/* Hour hand */}
      <line
        x1={45} y1={45}
        x2={45 + 14 * Math.cos((handAngle * 0.083 - 90) * Math.PI / 180)}
        y2={45 + 14 * Math.sin((handAngle * 0.083 - 90) * Math.PI / 180)}
        stroke={C.orange} strokeWidth={3} strokeLinecap="round"
      />
      <circle cx={45} cy={45} r={3} fill={C.orange} />
    </svg>
  );
};

// ─── Icon: Shop (cart) ───────────────────────────────────────
const ShopIcon: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width={90} height={90} viewBox="0 0 90 90" style={{ opacity: progress }}>
    <circle cx={45} cy={45} r={42} fill="rgba(232,98,10,0.12)" stroke={C.orange} strokeWidth={2} />
    <path
      d="M22 28 L28 28 L38 58 L64 58 L70 36 L34 36"
      fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
    />
    <circle cx={40} cy={65} r={4} fill={C.orange} />
    <circle cx={60} cy={65} r={4} fill={C.orange} />
    {/* Items in cart */}
    <rect x={44} y={40} width={8} height={10} rx={2} fill={C.orange} opacity={0.7} />
    <rect x={54} y={42} width={6} height={8} rx={2} fill={C.orange} opacity={0.5} />
  </svg>
);

// ─── Script Word Block ────────────────────────────────────────
const WordBlock: React.FC<{
  frame: number;
  startFrame: number;
  icon: React.ReactNode;
  highlight: string;
  rest: string;
  xOffset?: number;
}> = ({ frame, startFrame, icon, highlight, rest, xOffset = 0 }) => {
  const s = spr(frame, startFrame, FPS, { damping: 12, stiffness: 110 });
  const opacity = fadeIn(frame, startFrame, 12);
  const slideY = interpolate(s, [0, 1], [80, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 80 + xOffset,
        display: "flex",
        alignItems: "center",
        gap: 28,
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      {icon}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 72,
            color: C.orange,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            textShadow: `0 0 40px rgba(232,98,10,0.6)`,
          }}
        >
          {highlight}
        </span>
        {rest && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: 32,
              color: C.muted,
              lineHeight: 1.2,
              letterSpacing: "0.04em",
            }}
          >
            {rest}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Phone Mockup with App UI ─────────────────────────────────
const PhoneMockup: React.FC<{ frame: number }> = ({ frame }) => {
  const START = 87;
  const popScale = spr(frame, START, FPS, { damping: 11, stiffness: 130, mass: 0.9 });
  const scaleFrom3 = interpolate(popScale, [0, 1], [3, 1]);
  const opacity = fadeIn(frame, START, 8);

  // Glow pulse
  const glowPulse = 0.6 + 0.4 * Math.sin(frame * 0.15);

  const PH_W = 440;
  const PH_H = 950;
  const PH_R = 48;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 160,
        left: "50%",
        transform: `translateX(-50%) scale(${scaleFrom3})`,
        opacity,
        transformOrigin: "center bottom",
      }}
    >
      {/* Glow behind phone */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          borderRadius: 120,
          background: `radial-gradient(ellipse, rgba(255,107,0,${0.22 * glowPulse}) 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Realistic Hardware Buttons (Silver Chrome) */}
      {/* Volume Up */}
      <div style={{ position: "absolute", left: -8, top: 180, width: 5, height: 60, background: "linear-gradient(180deg, #d2d7df, #7f8c8d)", borderRadius: "3px 0 0 3px", border: "1px solid #7f8c8d", boxShadow: "-2px 0 5px rgba(0,0,0,0.4)", zIndex: 1 }} />
      {/* Volume Down */}
      <div style={{ position: "absolute", left: -8, top: 254, width: 5, height: 60, background: "linear-gradient(180deg, #d2d7df, #7f8c8d)", borderRadius: "3px 0 0 3px", border: "1px solid #7f8c8d", boxShadow: "-2px 0 5px rgba(0,0,0,0.4)", zIndex: 1 }} />
      {/* Action Button */}
      <div style={{ position: "absolute", left: -8, top: 124, width: 5, height: 32, background: "linear-gradient(180deg, #d2d7df, #7f8c8d)", borderRadius: "3px 0 0 3px", border: "1px solid #7f8c8d", boxShadow: "-2px 0 5px rgba(0,0,0,0.4)", zIndex: 1 }} />
      {/* Power Button */}
      <div style={{ position: "absolute", right: -8, top: 210, width: 5, height: 96, background: "linear-gradient(180deg, #d2d7df, #7f8c8d)", borderRadius: "0 3px 3px 0", border: "1px solid #7f8c8d", boxShadow: "2px 0 5px rgba(0,0,0,0.4)", zIndex: 1 }} />

      {/* Realistic Anisotropic Chrome/Silver Outer Ring */}
      <div
        style={{
          width: PH_W + 12,
          height: PH_H + 12,
          borderRadius: PH_R + 6,
          background: "linear-gradient(135deg, #abb2bf 0%, #f3f4f6 25%, #7f8c8d 50%, #ffffff 75%, #95a5a6 100%)",
          padding: 6,
          boxShadow: `
            0 35px 70px -15px rgba(0, 0, 0, 0.9),
            0 0 60px rgba(255,107,0,0.12),
            inset 0 1px 2px rgba(255,255,255,0.6),
            inset 0 -1px 2px rgba(0,0,0,0.4)
          `,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Physical Bezel Rim (Black) */}
        <div
          style={{
            width: PH_W,
            height: PH_H,
            borderRadius: PH_R,
            background: "#000",
            padding: 8,
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.9)",
            display: "flex",
            position: "relative",
          }}
        >
          {/* Active Screen Wrapper */}
          <div
            style={{
              flex: 1,
              borderRadius: PH_R - 8,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              background: "#0A0E14",
            }}
          >
            {/* iOS Dynamic Island */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 124,
                height: 30,
                background: "#000000",
                borderRadius: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                zIndex: 20,
                boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
              }}
            >
              {/* Front Camera Lens (realistic blue reflection) */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #0F132A 15%, #05060F 60%, #1A223E 100%)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "inset 0 0 2px rgba(255,255,255,0.2)",
                }}
              />
              {/* iOS Live indicator green dot */}
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#32D74B",
                  opacity: 0.85,
                  boxShadow: "0 0 4px #32D74B",
                }}
              />
            </div>

            {/* iOS Styled Status bar */}
            <div
              style={{
                height: 48,
                background: "#0A0E14",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 22px",
                position: "relative",
                zIndex: 18,
              }}
            >
              {/* Time display */}
              <span
                style={{
                  color: C.white,
                  fontSize: 13,
                  fontWeight: "700",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                9:41
              </span>

              {/* Status Icons */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {/* Cellular Signal Bars */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 10 }}>
                  {[3, 5, 7, 9].map((h, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 2.5,
                        height: h,
                        background: idx === 3 ? "rgba(255,255,255,0.3)" : C.white,
                        borderRadius: 0.5,
                      }}
                    />
                  ))}
                </div>

                {/* WiFi Arc Icon */}
                <svg width="13" height="10" viewBox="0 0 15 11" fill="none">
                  <path d="M7.5 11C8.32843 11 9 10.3284 9 9.5C9 8.67157 8.32843 8 7.5 8C6.67157 8 6 8.67157 6 9.5C6 10.3284 6.67157 11 7.5 11Z" fill="white" />
                  <path d="M7.5 5.5C9.25 5.5 10.85 6.2 12.05 7.4L13.1 6.35C11.6 4.85 9.65 4 7.5 4C5.35 4 3.4 4.85 1.9 6.35L2.95 7.4C4.15 6.2 5.75 5.5 7.5 5.5Z" fill="white" />
                  <path d="M7.5 1.5C10.5 1.5 13.2 2.7 15.15 4.65L16.2 3.6C13.95 1.35 10.9 0 7.5 0C4.1 0 1.05 1.35 -1.2 3.6L-0.15 4.65C1.8 2.7 4.5 1.5 7.5 1.5Z" fill="white" />
                </svg>

                {/* Battery Icon */}
                <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <div
                    style={{
                      width: 20,
                      height: 10,
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      borderRadius: 2.5,
                      padding: 1,
                      display: "flex",
                    }}
                  >
                    <div style={{ width: "100%", height: "100%", background: "#32D74B", borderRadius: 1 }} />
                  </div>
                  <div style={{ width: 1, height: 3.5, background: "rgba(255, 255, 255, 0.5)", borderRadius: "0 1px 1px 0" }} />
                </div>
              </div>
            </div>

            {/* App UI - mimicking the live Flutter web mobile app at shop.rebuzzpos.com */}
            <div style={{ background: "#0A0E14", padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", height: PH_H - 120, overflow: "hidden", position: "relative" }}>
              {/* Deliver to */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ color: "#FF6B00", fontSize: 18 }}>📍</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: C.muted, fontSize: 10, fontFamily: "Barlow, sans-serif" }}>Deliver to</span>
                  <span style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 13 }}>
                    Set delivery address ▾
                  </span>
                </div>
              </div>

              {/* Featured Label */}
              <div style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                Featured
              </div>

              {/* Featured cards row */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14, overflow: "hidden" }}>
                {[
                  { name: "Breaking Bread", cat: "Food", loc: "Street 17, Pokhara", logo: "🍞", logoBg: "#FFF9E6" },
                  { name: "Ek watch", cat: "Other", loc: "Pokhara", logo: "⌚", logoBg: "#1E2530" },
                  { name: "Peacezone", cat: "Food", loc: "Niva Galli, Pokhara", logo: "🍕", logoBg: "#FFF0F0" }
                ].map((f, i) => (
                  <div
                    key={i}
                    style={{
                      width: 130,
                      padding: "8px",
                      borderRadius: 10,
                      background: "#181E26",
                      border: `1px solid rgba(255,107,0,0.15)`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 5,
                        background: f.logoBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                      }}>
                        {f.logo}
                      </div>
                      <div style={{ overflow: "hidden", minWidth: 0 }}>
                        <div style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 10, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{f.name}</div>
                        <div style={{ color: C.muted, fontSize: 8, fontFamily: "Barlow, sans-serif" }}>{f.cat}</div>
                      </div>
                    </div>
                    <div style={{ color: C.muted, fontSize: 8, fontFamily: "Barlow, sans-serif", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>📍 {f.loc}</div>
                  </div>
                ))}
              </div>

              {/* Sponsors Section */}
              <div style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                Sponsors
              </div>
              <div
                style={{
                  background: "linear-gradient(135deg, #1E2530, #181E26)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  border: "1px solid rgba(255,107,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: "rgba(255,107,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}>
                    🚀
                  </div>
                  <div>
                    <div style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 11 }}>Resume AI</div>
                    <div style={{ color: C.muted, fontSize: 8, fontFamily: "Barlow, sans-serif" }}>Smart App Builder</div>
                  </div>
                </div>
                <div style={{
                  background: "#FF6B00",
                  color: C.white,
                  fontFamily: "Barlow, sans-serif",
                  fontWeight: 700,
                  fontSize: 9,
                  padding: "3px 8px",
                  borderRadius: 8,
                  textTransform: "uppercase",
                }}>
                  Visit
                </div>
              </div>

              {/* Businesses label */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 15 }}>
                  Businesses
                </span>
                <span style={{ color: "#FF6B00", fontSize: 11, fontFamily: "Barlow, sans-serif", fontWeight: 700 }}>
                  Sort ☰
                </span>
              </div>

              {/* Static Business list view */}
              <div style={{ flex: 1, overflow: "hidden", position: "relative", marginBottom: 60 }}>
                {[
                  { name: "Breaking Bread Pvt Ltd", cat: "Food", loc: "Street 17, Pokhara", logo: "🥖", logoBg: "#FFF5E6" },
                  { name: "Demo Business", cat: "Tourism", loc: "Nadipur, Pokhara", logo: "🐝", logoBg: "#EBF3FF" },
                  { name: "Foxys Corner", cat: "Other", loc: "Lakeside, Pokhara", logo: "🦊", logoBg: "#E8F5E9" },
                  { name: "Cheese Shop", cat: "Food", loc: "Lakeside, Pokhara", logo: "🧀", logoBg: "#FFFDE6" },
                  { name: "Charumaitri Healing", cat: "Wellness", loc: "Boudha, Pokhara", logo: "🧘", logoBg: "#F3E8FF" },
                  { name: "Ek watch", cat: "Other", loc: "Newroad, Pokhara", logo: "⌚", logoBg: "#E2E8F0" },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#181E26",
                      borderRadius: 10,
                      padding: "8px 10px",
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: b.logoBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {b.logo}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                        {b.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                        <span style={{ color: C.muted, fontSize: 8, fontFamily: "Barlow, sans-serif" }}>{b.cat}</span>
                        <span style={{ color: C.muted, fontSize: 8 }}>•</span>
                        <span style={{ color: C.muted, fontSize: 8, fontFamily: "Barlow, sans-serif", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>📍 {b.loc}</span>
                      </div>
                    </div>
                    <div style={{ color: "#FF6B00", fontSize: 12, fontWeight: "bold" }}>
                      ❯
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom nav */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                background: "#0A0E14",
                borderTop: `1px solid rgba(255,107,0,0.15)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                paddingBottom: 6,
              }}
            >
              {[
                { icon: "🏠", label: "Home", active: true },
                { icon: "🔍", label: "Search" },
                { icon: "🛍️", label: "Cart" },
                { icon: "👤", label: "Account" },
              ].map((n, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <span style={{ fontSize: 18, opacity: n.active ? 1.0 : 0.4 }}>{n.icon}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "Barlow, sans-serif",
                      color: n.active ? "#FF6B00" : C.muted,
                      fontWeight: n.active ? 700 : 400,
                    }}
                  >
                    {n.label}
                  </span>
                </div>
              ))}
            </div>

            {/* iOS Bottom Indicator Bar */}
            <div
              style={{
                position: "absolute",
                bottom: 5,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 4,
                background: "rgba(255, 255, 255, 0.4)",
                borderRadius: 2,
                zIndex: 30,
                pointerEvents: "none",
              }}
            />

            {/* Glass Screen Reflection Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(
                  125deg,
                  rgba(255, 255, 255, 0.05) 0%,
                  rgba(255, 255, 255, 0.03) 30%,
                  rgba(255, 255, 255, 0) 30.1%,
                  rgba(255, 255, 255, 0) 70%,
                  rgba(255, 255, 255, 0.02) 70.1%,
                  rgba(255, 255, 255, 0.04) 100%
                )`,
                pointerEvents: "none",
                zIndex: 25,
              }}
            />

            {/* Scan line overlay inside the screen */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 3px,
                  rgba(0,0,0,0.06) 3px,
                  rgba(0,0,0,0.06) 4px
                )`,
                pointerEvents: "none",
                zIndex: 22,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── "From Your Phone" CTA Banner ────────────────────────────
const CTABanner: React.FC<{ frame: number }> = ({ frame }) => {
  const START = 126;
  const s = spr(frame, START, FPS, { damping: 14, stiffness: 100 });
  const opacity = fadeIn(frame, START, 12);
  const slideY = interpolate(s, [0, 1], [40, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 1140,
        left: "50%",
        transform: `translateX(-50%) translateY(${slideY}px)`,
        opacity,
        width: 900,
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, rgba(232,98,10,0.15), rgba(26,47,90,0.15))`,
          border: `1px solid rgba(232,98,10,0.35)`,
          borderRadius: 20,
          padding: "16px 40px",
          backdropFilter: "blur(10px)",
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 38,
            color: C.white,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          from your{" "}
          <span style={{ color: C.orange, textShadow: `0 0 20px rgba(232,98,10,0.8)` }}>
            PHONE
          </span>{" "}
          📱
        </span>
      </div>
    </div>
  );
};

// ─── Final Fade ───────────────────────────────────────────────
const FinalFade: React.FC<{ frame: number; totalFrames: number }> = ({ frame, totalFrames }) => {
  const opacity = interpolate(
    frame,
    [totalFrames - 9, totalFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{ background: "#000", opacity, pointerEvents: "none" }}
    />
  );
};

// ─── MAIN COMPOSITION ─────────────────────────────────────────
export const RebuzzBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const stressProgress = spr(frame, 15, fps);
  const timeProgress = spr(frame, 39, fps);
  const shopProgress = spr(frame, 63, fps);

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: "Barlow, sans-serif", overflow: "hidden" }}>

      {/* Layer 0: Grid background */}
      <GridBG frame={frame} />

      {/* Layer 1: Floating particles */}
      <Particles frame={frame} />

      {/* Layer 2: Corner brackets */}
      <CornerBrackets frame={frame} />

      {/* Layer 3: Script word blocks */}
      <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>

        {/* DON'T STRESS */}
        <div style={{ position: "relative", height: 120, marginBottom: 24 }}>
          <WordBlock
            frame={frame}
            startFrame={15}
            icon={<StressIcon progress={clamp01(stressProgress)} />}
            highlight="DON'T STRESS"
            rest=""
          />
          {/* Underline accent */}
          <div
            style={{
              position: "absolute",
              left: 80,
              bottom: 0,
              height: 3,
              width: interpolate(frame, [20, 38], [0, 520], { extrapolateRight: "clamp" }),
              background: `linear-gradient(90deg, ${C.orange}, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>

        {/* SAVE YOUR TIME */}
        <div style={{ position: "relative", height: 130, marginBottom: 24, paddingLeft: 60 }}>
          <WordBlock
            frame={frame}
            startFrame={39}
            icon={<TimeIcon progress={clamp01(timeProgress)} frame={frame} />}
            highlight="SAVE YOUR TIME"
            rest=""
          />
          <div
            style={{
              position: "absolute",
              left: 80 + 60,
              bottom: 0,
              height: 3,
              width: interpolate(frame, [44, 62], [0, 580], { extrapolateRight: "clamp" }),
              background: `linear-gradient(90deg, ${C.orange}, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>

        {/* SHOP FOR WHAT YOU NEED */}
        <div style={{ position: "relative", height: 130, marginBottom: 0 }}>
          <WordBlock
            frame={frame}
            startFrame={63}
            icon={<ShopIcon progress={clamp01(shopProgress)} />}
            highlight="SHOP ANYTHING"
            rest="for what you need"
          />
          <div
            style={{
              position: "absolute",
              left: 80,
              bottom: 0,
              height: 3,
              width: interpolate(frame, [68, 86], [0, 650], { extrapolateRight: "clamp" }),
              background: `linear-gradient(90deg, ${C.orange}, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {/* Layer 4: Phone mockup */}
      <PhoneMockup frame={frame} />

      {/* Layer 5: "From your phone" CTA */}
      <CTABanner frame={frame} />

      {/* Layer 6: Scanline texture overlay */}
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
        }}
      />

      {/* Layer 7: Final fade */}
      <FinalFade frame={frame} totalFrames={durationInFrames} />

      {/* ─── Synchronized Cinematic Audio Tracks ─── */}
      {/* 1. Brackets Intro Whoosh (starts exactly at Frame 0) */}
      <Sequence from={0} durationInFrames={35} name="Brackets Intro Whoosh">
        <Audio src={staticFile("asset/whoosh.wav")} volume={0.35} />
      </Sequence>

      {/* 2. Stress Pop (starts exactly at Frame 15) */}
      <Sequence from={15} durationInFrames={30} name="Stress Pop">
        <Audio src={staticFile("asset/pop.mp3")} volume={0.55} />
      </Sequence>

      {/* 3. Time Pop (starts exactly at Frame 39) */}
      <Sequence from={39} durationInFrames={30} name="Time Pop">
        <Audio src={staticFile("asset/pop.mp3")} volume={0.55} />
      </Sequence>

      {/* 4. Shop Pop (starts exactly at Frame 63) */}
      <Sequence from={63} durationInFrames={30} name="Shop Pop">
        <Audio src={staticFile("asset/pop.mp3")} volume={0.55} />
      </Sequence>

      {/* 5. iPhone Mockup Whoosh (starts exactly at Frame 87) */}
      <Sequence from={87} durationInFrames={40} name="iPhone Mockup Whoosh">
        <Audio src={staticFile("asset/whoosh.wav")} volume={0.45} />
      </Sequence>

      {/* 6. Phone CTA Ding (starts exactly at Frame 126) */}
      <Sequence from={126} durationInFrames={40} name="Phone CTA Ding">
        <Audio src={staticFile("asset/ding.wav")} volume={0.45} />
      </Sequence>

    </AbsoluteFill>
  );
};

export default RebuzzBroll;
