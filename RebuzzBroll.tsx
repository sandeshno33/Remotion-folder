import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";

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
const fadeOut = (frame: number, start: number, dur = 10) =>
  clamp01(1 - (frame - start) / dur);

// ─── Scene timing ────────────────────────────────────────────
// 0–30:   Dark BG builds in, grid flickers on
// 30–70:  Stress icon + word "Don't stress" slams in
// 70–110: Clock icon + "save your time" sweeps in
// 110–155: Cart icon + "shop for what you need" reveals
// 155–210: Phone mockup with app UI pops in from below
// 210–240: Final glow + hold + fade

// ─── Grid Background ─────────────────────────────────────────
const GridBG: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
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
    { x: 80,  y: 300,  size: 22, shape: "hex",  delay: 5,  speed: 0.4, rot: 30  },
    { x: 950, y: 420,  size: 16, shape: "tri",  delay: 12, speed: 0.3, rot: 15  },
    { x: 140, y: 750,  size: 28, shape: "hex",  delay: 8,  speed: 0.5, rot: 60  },
    { x: 980, y: 900,  size: 18, shape: "tri",  delay: 20, speed: 0.35, rot: 90 },
    { x: 60,  y: 1150, size: 24, shape: "hex",  delay: 3,  speed: 0.45, rot: 45 },
    { x: 990, y: 1300, size: 14, shape: "tri",  delay: 15, speed: 0.28, rot: 10 },
    { x: 200, y: 1550, size: 20, shape: "hex",  delay: 25, speed: 0.38, rot: 70 },
    { x: 870, y: 1700, size: 26, shape: "tri",  delay: 10, speed: 0.5, rot: 20  },
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
  const scale = spr(frame, 10, FPS);
  const opacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const size = 70;
  const thick = 4;
  const margin = 48;
  const color = C.orange;

  const corners = [
    { x: margin,     y: margin,      rx: 1, ry: 1 },
    { x: W - margin, y: margin,      rx: -1, ry: 1 },
    { x: margin,     y: H - margin,  rx: 1, ry: -1 },
    { x: W - margin, y: H - margin,  rx: -1, ry: -1 },
  ];

  return (
    <svg style={{ position: "absolute", inset: 0, opacity }} width={W} height={H}>
      {corners.map((c, i) => (
        <g key={i} transform={`translate(${c.x},${c.y}) scale(${scale * c.rx},${scale * c.ry})`}>
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
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
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
  const START = 155;
  const popScale = spr(frame, START, FPS, { damping: 11, stiffness: 130, mass: 0.9 });
  const scaleFrom3 = interpolate(popScale, [0, 1], [3, 1]);
  const opacity = fadeIn(frame, START, 8);

  // Glow pulse
  const glowPulse = 0.6 + 0.4 * Math.sin(frame * 0.15);

  const PH_W = 560;
  const PH_H = 860;
  const PH_R = 50;

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
          background: `radial-gradient(ellipse, rgba(232,98,10,${0.25 * glowPulse}) 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />

      {/* Phone shell */}
      <div
        style={{
          width: PH_W,
          height: PH_H,
          borderRadius: PH_R,
          border: `3px solid rgba(232,98,10,0.8)`,
          background: "#0D1118",
          overflow: "hidden",
          boxShadow: `0 0 60px rgba(232,98,10,0.3), inset 0 0 20px rgba(0,0,0,0.8)`,
          position: "relative",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 36,
            background: "#141B26",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
          }}
        >
          <span style={{ color: C.muted, fontSize: 16, fontFamily: "monospace" }}>9:41</span>
          <div
            style={{
              width: 80,
              height: 16,
              background: "#0D1118",
              borderRadius: 10,
            }}
          />
          <span style={{ color: C.muted, fontSize: 16, fontFamily: "monospace" }}>●●●</span>
        </div>

        {/* App UI - mimicking the uploaded screenshot */}
        <div style={{ background: "#111720", padding: "14px 18px", flex: 1 }}>
          {/* Deliver to */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ color: C.muted, fontSize: 14, fontFamily: "Barlow, sans-serif" }}>Deliver to</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span style={{ color: C.orange, fontSize: 18 }}>📍</span>
            <span style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 16 }}>
              Set delivery address ▾
            </span>
          </div>

          {/* Featured label */}
          <div style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>
            Featured
          </div>

          {/* Featured cards row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 18, overflow: "hidden" }}>
            {["#1A2030", "#0D1118", "#1A2030"].map((bg, i) => (
              <div
                key={i}
                style={{
                  width: i === 0 ? 160 : 120,
                  height: 90,
                  borderRadius: 10,
                  background: bg,
                  border: `1px solid rgba(232,98,10,0.25)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: C.orange, fontSize: 26 }}>{["🛍", "⌚", "🕊"][i]}</span>
              </div>
            ))}
          </div>

          {/* Businesses label */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 16 }}>
              Businesses
            </span>
            <span style={{ color: C.orange, fontSize: 13, fontFamily: "Barlow, sans-serif" }}>⇅ Sort</span>
          </div>

          {/* Business cards */}
          {[
            { name: "Demo Business", cat: "Tourism", loc: "Nadipur, Pokhara" },
            { name: "Breaking Bread", cat: "Food", loc: "Street 17, Pokhara" },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                background: "#1A2030",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#0D1118",
                  border: `2px solid ${C.orange}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: C.orange, fontSize: 20 }}>{["🦋", "🍞"][i]}</span>
              </div>
              <div>
                <div style={{ color: C.white, fontFamily: "Barlow, sans-serif", fontWeight: 700, fontSize: 13 }}>
                  {b.name}
                </div>
                <div style={{ color: C.muted, fontSize: 11, fontFamily: "Barlow, sans-serif" }}>{b.cat}</div>
                <div style={{ color: C.muted, fontSize: 10, fontFamily: "Barlow, sans-serif" }}>📍 {b.loc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            background: "#141B26",
            borderTop: `1px solid rgba(232,98,10,0.2)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {[
            { icon: "🏠", label: "Home", active: true },
            { icon: "🔍", label: "Search" },
            { icon: "🛒", label: "Cart" },
            { icon: "👤", label: "Account" },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 20 }}>{n.icon}</span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "Barlow, sans-serif",
                  color: n.active ? C.orange : C.muted,
                  fontWeight: n.active ? 700 : 400,
                }}
              >
                {n.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scan line overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.08) 3px,
            rgba(0,0,0,0.08) 4px
          )`,
          borderRadius: PH_R,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

// ─── "From Your Phone" CTA Banner ────────────────────────────
const CTABanner: React.FC<{ frame: number }> = ({ frame }) => {
  const START = 195;
  const s = spr(frame, START, FPS, { damping: 14, stiffness: 100 });
  const opacity = fadeIn(frame, START, 12);
  const slideY = interpolate(s, [0, 1], [40, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 1040,
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
          </span>
          . 📱
        </span>
      </div>
    </div>
  );
};

// ─── Final Fade ───────────────────────────────────────────────
const FinalFade: React.FC<{ frame: number; totalFrames: number }> = ({ frame, totalFrames }) => {
  const opacity = interpolate(
    frame,
    [totalFrames - 20, totalFrames],
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

  const stressProgress = spr(frame, 30, fps);
  const timeProgress = spr(frame, 75, fps);
  const shopProgress = spr(frame, 120, fps);

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
            startFrame={30}
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
              width: interpolate(frame, [35, 60], [0, 520], { extrapolateRight: "clamp" }),
              background: `linear-gradient(90deg, ${C.orange}, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>

        {/* SAVE YOUR TIME */}
        <div style={{ position: "relative", height: 130, marginBottom: 24, paddingLeft: 60 }}>
          <WordBlock
            frame={frame}
            startFrame={75}
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
              width: interpolate(frame, [80, 105], [0, 580], { extrapolateRight: "clamp" }),
              background: `linear-gradient(90deg, ${C.orange}, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>

        {/* SHOP FOR WHAT YOU NEED */}
        <div style={{ position: "relative", height: 130, marginBottom: 0 }}>
          <WordBlock
            frame={frame}
            startFrame={120}
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
              width: interpolate(frame, [125, 155], [0, 650], { extrapolateRight: "clamp" }),
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
          opacity: 0.6,
        }}
      />

      {/* Layer 7: Final fade */}
      <FinalFade frame={frame} totalFrames={durationInFrames} />

    </AbsoluteFill>
  );
};

export default RebuzzBroll;
