import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  Sequence,
  staticFile,
  Img
} from "remotion";
import { Logo } from "./Logo";

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

// ─── Helper: Easing Springs ──────────────────────────────────
const spr = (frame: number, delay: number, fps: number, cfg = {}) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8, ...cfg },
  });

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
        opacity: opacity * 0.7,
        backgroundImage: `
          linear-gradient(to right, ${C.grid} 1px, transparent 1px),
          linear-gradient(to bottom, ${C.grid} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        backgroundPosition: "center center",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

// ─── Floating Geometric Tech Particles ────────────────────────
const Particles: React.FC<{ frame: number; width: number; height: number }> = ({
  frame,
  width,
  height,
}) => {
  const isLandscape = width > height;

  // Adapt particle layout to widescreen vs portrait bounds
  const pList = isLandscape
    ? [
        { x: width * 0.1, y: height * 0.25, size: 24, rot: 15, speed: 0.35, shape: "tri" },
        { x: width * 0.45, y: height * 0.15, size: 30, rot: 45, speed: -0.28, shape: "hex" },
        { x: width * 0.85, y: height * 0.2, size: 26, rot: 110, speed: 0.45, shape: "hex" },
        { x: width * 0.15, y: height * 0.8, size: 32, rot: -40, speed: -0.32, shape: "tri" },
        { x: width * 0.5, y: height * 0.85, size: 22, rot: 75, speed: 0.3, shape: "hex" },
        { x: width * 0.88, y: height * 0.75, size: 28, rot: 90, speed: -0.4, shape: "tri" },
      ]
    : [
        { x: width * 0.12, y: height * 0.18, size: 22, rot: 15, speed: 0.35, shape: "tri" },
        { x: width * 0.85, y: height * 0.25, size: 28, rot: 45, speed: -0.28, shape: "hex" },
        { x: width * 0.15, y: height * 0.6, size: 24, rot: 110, speed: 0.45, shape: "hex" },
        { x: width * 0.82, y: height * 0.72, size: 30, rot: -40, speed: -0.32, shape: "tri" },
        { x: width * 0.2, y: height * 0.88, size: 20, rot: 75, speed: 0.3, shape: "hex" },
        { x: width * 0.88, y: height * 0.12, size: 18, rot: 90, speed: -0.4, shape: "tri" },
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
              clipPath:
                p.shape === "tri"
                  ? "polygon(50% 0%, 100% 100%, 0% 100%)"
                  : "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Corner Brackets Overlay ─────────────────────────────────
const CornerBrackets: React.FC<{ frame: number; width: number; height: number }> = ({
  frame,
  width,
  height,
}) => {
  const isLandscape = width > height;
  const isSquare = width === height;
  const s = spr(frame, 0, 30, { damping: 12, stiffness: 95 });

  const margin = isLandscape ? 60 : isSquare ? 36 : 48;
  const offset = interpolate(s, [0, 1], [150, margin]);
  const len = isLandscape ? 60 : 70;
  const th = 4;

  const bracketStyle: React.CSSProperties = {
    position: "absolute",
    borderColor: C.orange,
    borderStyle: "solid",
    width: len,
    height: len,
    filter: `drop-shadow(0 0 10px rgba(232, 98, 10, 0.45))`,
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 10 }}>
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

// ─── Animated Icons for Scene 2 ──────────────────────────────
const StressIcon: React.FC<{ progress: number }> = ({ progress }) => (
  <svg
    width={120}
    height={120}
    viewBox="0 0 90 90"
    style={{ opacity: progress, filter: `drop-shadow(0 0 15px rgba(232,98,10,0.5))` }}
  >
    <circle cx={45} cy={45} r={42} fill="rgba(232,98,10,0.15)" stroke={C.orange} strokeWidth={2} />
    <path d="M50 18 L32 48 L46 48 L38 72 L62 40 L48 40 Z" fill={C.orange} opacity={0.95} />
  </svg>
);

const ClockIcon: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const handAngle = (frame * 8) % 360;
  return (
    <svg
      width={120}
      height={120}
      viewBox="0 0 90 90"
      style={{ opacity: progress, filter: `drop-shadow(0 0 15px rgba(232,98,10,0.4))` }}
    >
      <circle cx={45} cy={45} r={42} fill="rgba(232,98,10,0.15)" stroke={C.orange} strokeWidth={2} />
      <circle cx={45} cy={45} r={30} fill="none" stroke={C.orange} strokeWidth={1.5} />
      {[0, 90, 180, 270].map((a, i) => (
        <line
          key={i}
          x1={45 + 28 * Math.cos((a - 90) * Math.PI / 180)}
          y1={45 + 28 * Math.sin((a - 90) * Math.PI / 180)}
          x2={45 + 22 * Math.cos((a - 90) * Math.PI / 180)}
          y2={45 + 22 * Math.sin((a - 90) * Math.PI / 180)}
          stroke={C.orange}
          strokeWidth={2.5}
        />
      ))}
      <line
        x1={45}
        y1={45}
        x2={45 + 22 * Math.cos((handAngle - 90) * Math.PI / 180)}
        y2={45 + 22 * Math.sin((handAngle - 90) * Math.PI / 180)}
        stroke={C.white}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <line
        x1={45}
        y1={45}
        x2={45 + 14 * Math.cos((handAngle * 0.08 - 90) * Math.PI / 180)}
        y2={45 + 14 * Math.sin((handAngle * 0.08 - 90) * Math.PI / 180)}
        stroke={C.orange}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <circle cx={45} cy={45} r={4} fill={C.orange} />
    </svg>
  );
};

// ─── Phone Mockup with App UI & Micro-interactions ───────────
const PhoneMockup: React.FC<{ frame: number; scale: number; isLandscape: boolean }> = ({
  frame,
  scale,
  isLandscape,
}) => {
  const PH_W = 440;
  const PH_H = 950;
  const PH_R = 48;

  // Tap ripple effect at frame 225
  const rippleProgress = spr(frame, 225, 30, { damping: 15, stiffness: 80 });
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.2, 2.5]);
  const rippleOpacity = interpolate(rippleProgress, [0, 1], [0.85, 0], {
    extrapolateRight: "clamp",
  });

  // Business Card Highlight pulse (starts at frame 225, holds, then settles)
  const cardHighlight = interpolate(frame, [225, 235, 260, 270], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: PH_W + 12,
        height: PH_H + 12,
        transform: `scale(${scale})`,
        transformOrigin: isLandscape ? "center center" : "center bottom",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Soft Glow behind phone */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          borderRadius: 120,
          background: `radial-gradient(ellipse, rgba(232,98,10,0.18) 0%, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Silver Chrome Outer Rim */}
      <div
        style={{
          width: PH_W + 12,
          height: PH_H + 12,
          borderRadius: PH_R + 6,
          background: "linear-gradient(135deg, #abb2bf 0%, #f3f4f6 25%, #7f8c8d 50%, #ffffff 75%, #95a5a6 100%)",
          padding: 6,
          boxShadow: `
            0 35px 70px -15px rgba(0, 0, 0, 0.85),
            0 0 40px rgba(255,107,0,0.08),
            inset 0 1px 2px rgba(255,255,255,0.6)
          `,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Physical Black Bezel */}
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
          {/* Active Screen Area */}
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
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #0F132A 15%, #05060F 60%, #1A223E 100%)",
                  boxShadow: "inset 0 0 2px rgba(255,255,255,0.2)",
                }}
              />
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

            {/* iOS Status Bar */}
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
              <span
                style={{
                  color: C.white,
                  fontSize: 13,
                  fontWeight: "700",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                9:41
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 10 }}>
                  {[3, 5, 7, 9].map((h, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 2.5,
                        height: h,
                        background: C.white,
                        borderRadius: 0.5,
                      }}
                    />
                  ))}
                </div>
                {/* Wifi icon */}
                <span style={{ color: C.white, fontSize: 10 }}>📶</span>
                {/* Battery icon */}
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
              </div>
            </div>

            {/* App Body - shop.rebuzzpos.com replication */}
            <div
              style={{
                background: "#0A0E14",
                padding: "12px 14px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Location marker */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ color: "#FF6B00", fontSize: 18 }}>📍</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: C.muted, fontSize: 9, fontFamily: "Barlow, sans-serif" }}>Deliver to</span>
                  <span
                    style={{
                      color: C.white,
                      fontFamily: "Barlow, sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    Lakeside, Pokhara ▾
                  </span>
                </div>
              </div>

              {/* Featured Section */}
              <div
                style={{
                  color: C.white,
                  fontFamily: "Barlow, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 6,
                }}
              >
                Featured Shops
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[
                  { name: "Breaking Bread", cat: "Bakery", logo: "🍞", logoBg: "#FFF9E6" },
                  { name: "Ek watch", cat: "Watches", logo: "⌚", logoBg: "#1E2530" },
                  { name: "Peacezone", cat: "Pizza", logo: "🍕", logoBg: "#FFF0F0" },
                ].map((f, i) => (
                  <div
                    key={i}
                    style={{
                      width: 120,
                      padding: "8px",
                      borderRadius: 10,
                      background: "#181E26",
                      border: `1px solid rgba(255,107,0,0.15)`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 5,
                          background: f.logoBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                        }}
                      >
                        {f.logo}
                      </div>
                      <div style={{ overflow: "hidden", minWidth: 0 }}>
                        <div
                          style={{
                            color: C.white,
                            fontFamily: "Barlow, sans-serif",
                            fontWeight: 700,
                            fontSize: 10,
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {f.name}
                        </div>
                        <div
                          style={{
                            color: C.muted,
                            fontSize: 8,
                            fontFamily: "Barlow, sans-serif",
                          }}
                        >
                          {f.cat}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Businesses list (Interactive Item) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    color: C.white,
                    fontFamily: "Barlow, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  Nearby Businesses
                </span>
                <span style={{ color: "#FF6B00", fontSize: 10, fontWeight: 700 }}>View All ❯</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
                {[
                  {
                    name: "Breaking Bread Pvt Ltd",
                    cat: "Food & Bakery",
                    loc: "Street 17, Pokhara",
                    logo: "🥖",
                    logoBg: "#FFF5E6",
                    interactive: true,
                  },
                  {
                    name: "Demo Business",
                    cat: "Tourism Services",
                    loc: "Nadipur, Pokhara",
                    logo: "🐝",
                    logoBg: "#EBF3FF",
                  },
                  {
                    name: "Foxys Corner",
                    cat: "Accessories",
                    loc: "Lakeside, Pokhara",
                    logo: "🦊",
                    logoBg: "#E8F5E9",
                  },
                  {
                    name: "Cheese Shop",
                    cat: "Gourmet Food",
                    loc: "Lakeside, Pokhara",
                    logo: "🧀",
                    logoBg: "#FFFDE6",
                  },
                ].map((b, i) => {
                  const borderStyle = b.interactive
                    ? {
                        border: `1.5px solid rgba(232, 98, 10, ${cardHighlight * 0.85 + 0.05})`,
                        boxShadow: `0 0 ${cardHighlight * 20}px rgba(232, 98, 10, ${cardHighlight * 0.3})`,
                      }
                    : { border: "1px solid rgba(255,255,255,0.03)" };

                  return (
                    <div
                      key={i}
                      style={{
                        background: "#181E26",
                        borderRadius: 10,
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        position: "relative",
                        transition: "all 0.15s ease",
                        ...borderStyle,
                      }}
                    >
                      {/* Active click ripple animation overlay inside the card */}
                      {b.interactive && frame >= 165 && (
                        <div
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(232, 98, 10, 0.4) 0%, transparent 70%)",
                            transform: `translate(-50%, -50%) scale(${rippleScale})`,
                            opacity: rippleOpacity,
                            pointerEvents: "none",
                            zIndex: 10,
                          }}
                        />
                      )}

                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: b.logoBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {b.logo}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: C.white,
                            fontFamily: "Barlow, sans-serif",
                            fontWeight: 700,
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {b.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 1,
                          }}
                        >
                          <span style={{ color: C.muted, fontSize: 9, fontFamily: "Barlow, sans-serif" }}>
                            {b.cat}
                          </span>
                          <span style={{ color: C.muted, fontSize: 8 }}>•</span>
                          <span
                            style={{
                              color: C.muted,
                              fontSize: 9,
                              fontFamily: "Barlow, sans-serif",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            📍 {b.loc}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          color: b.interactive && cardHighlight > 0.5 ? "#FF7B24" : "#FF6B00",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        ❯
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Bar */}
            <div
              style={{
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
                  <span style={{ fontSize: 18, opacity: n.active ? 1.0 : 0.45 }}>{n.icon}</span>
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

            {/* iOS bottom bar indicator */}
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
              }}
            />

            {/* Screen Glass Reflection Overlay */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Call to Action Card for Outro ───────────────────────────
const QRCodeCard: React.FC<{ frame: number; scale: number }> = ({ frame, scale }) => {
  const gleamProgress = interpolate(frame, [276 + 15, 276 + 35], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        zIndex: 10,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 380,
          height: 380,
          borderRadius: 28,
          background: "rgba(20, 27, 38, 0.82)",
          border: `1.5px solid rgba(232, 98, 10, 0.3)`,
          boxShadow: `
            0 25px 50px rgba(0,0,0,0.65), 
            0 0 30px rgba(232, 98, 10, 0.08)
          `,
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gleam swipe line across card */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 80,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)`,
            transform: `skewX(-25deg) translateX(${gleamProgress}%)`,
            pointerEvents: "none",
          }}
        />

        {/* 4 Corner tech brackets inside the card */}
        {[
          { left: 14, top: 14, borderLeft: "3px solid #E8620A", borderTop: "3px solid #E8620A" },
          { right: 14, top: 14, borderRight: "3px solid #E8620A", borderTop: "3px solid #E8620A" },
          { left: 14, bottom: 14, borderLeft: "3px solid #E8620A", borderBottom: "3px solid #E8620A" },
          { right: 14, bottom: 14, borderRight: "3px solid #E8620A", borderBottom: "3px solid #E8620A" },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 18,
              height: 18,
              ...c,
              filter: `drop-shadow(0 0 4px rgba(232, 98, 10, 0.7))`,
            }}
          />
        ))}

        {/* QR Backing */}
        <div
          style={{
            width: 270,
            height: 270,
            borderRadius: 16,
            background: C.white,
            padding: 16,
            boxShadow: "inset 0 0 15px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("asset/qr.png")}
            alt="Rebuzz QR Download"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── FINAL RESPONSIVE PROMO COMPOSITION ──────────────────────
export const RebuzzOrderingPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const isLandscape = width > height;
  const isSquare = width === height;

  // Timeline variables
  const logoIntro = spr(frame, 5, 30, { damping: 11, mass: 0.6, stiffness: 90 });
  const logoSweep = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const logoSpin = spr(frame, 5, 30, { damping: 13, mass: 0.55, stiffness: 85 });
  const logoRotation = interpolate(logoSpin, [0, 1], [-180, 0]);
  const wingActive = frame >= 10 && frame <= 50;

  // Scene 1 Intro settles & dissolves
  const scene1Dissolve = interpolate(frame, [68, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 2 Pain & Value Statement Elements
  const painStart = 82;
  const painS = spr(frame, painStart, 30, { damping: 13 });
  const painOpacity = interpolate(frame, [painStart, painStart + 10, 120, 125], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const painSlideY = interpolate(painS, [0, 1], [60, 0]);

  const valueStart = 125;
  const valueS = spr(frame, valueStart, 30, { damping: 13 });
  const valueOpacity = interpolate(frame, [valueStart, valueStart + 10, 163, 168], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const valueSlideY = interpolate(valueS, [0, 1], [60, 0]);

  // Scene 3 Phone Solutions Entrance
  const phoneEntranceStart = 168;
  const phoneS = spr(frame, phoneEntranceStart, 30, { damping: 12, stiffness: 100 });
  
  // Phone fades out and slides down during Scene 4 to exit completely
  const phoneExitS = spr(frame, 264, 30);
  const phoneOpacity =
    fadeIn(frame, phoneEntranceStart, 12) *
    interpolate(frame, [264, 276], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Perfect responsive scales for the phone mockup inside Scene 3
  const phoneScale = isLandscape
    ? 0.72 // 16:9 Landscape: scaled to 0.72 (height ~690px) to prevent vertical cut-off
    : isSquare
    ? 0.82 // 1:1 Square: scaled to 0.82 (height ~785px) to fill square canvas without clipping
    : 1.35; // 9:16 Portrait: scaled to 1.35 (height ~1295px) to fill tall mobile canvas

  // Phone Mockup vertical slide transitions
  const phoneSlideY = interpolate(phoneS, [0, 1], [height * 0.75, 0]);
  const phoneFinalY = interpolate(phoneExitS, [0, 1], [phoneSlideY, height * 0.8]);
  const phoneFinalX = 0;
  const phoneFinalScale = phoneScale;

  // Scene 3 Text Details
  const s3TextS = spr(frame, phoneEntranceStart + 10, 30);
  const s3TextOpacity = fadeIn(frame, phoneEntranceStart + 10, 15);
  const s3TextSlideY = interpolate(s3TextS, [0, 1], [30, 0]);

  // Scene 4 Call to Action Elements
  const ctaStart = 276;
  const ctaS = spr(frame, ctaStart, 30, { damping: 12, stiffness: 100 });
  const ctaScale = interpolate(ctaS, [0, 1], [0.4, isLandscape ? 1.0 : isSquare ? 0.75 : 0.95]);
  const ctaOpacity = fadeIn(frame, ctaStart, 12);
  const ctaRotate = interpolate(ctaS, [0, 1], [-8, 0]);

  const ctaTextS = spr(frame, ctaStart + 10, 30);
  const ctaTextOpacity = fadeIn(frame, ctaStart + 10, 15);
  const ctaTextSlideY = interpolate(ctaTextS, [0, 1], [30, 0]);

  // Final Scene Transition: black fade out at frames 397–412
  const finalFadeOpacity = interpolate(frame, [397, 412], [0, 1], {
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
      <Particles frame={frame} width={width} height={height} />

      {/* Snap-in Corner Brackets */}
      <CornerBrackets frame={frame} width={width} height={height} />

      {/* Glow Center Halos */}
      <div
        style={{
          position: "absolute",
          width: isLandscape ? "1000px" : "700px",
          height: isLandscape ? "1000px" : "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232, 98, 10, 0.1) 0%, rgba(26, 47, 90, 0.03) 50%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          opacity: 1 - finalFadeOpacity,
        }}
      />

      {/* ========================================================================= */}
      {/* SCENE 1: BRAND INTRO (0s – 1.67s / Frames 0 to 50)                        */}
      {/* ========================================================================= */}
      {frame < 78 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1 - scene1Dissolve,
            transform: `scale(${1 - scene1Dissolve * 0.15})`,
            zIndex: 15,
          }}
        >
          {/* Logo element */}
          <div style={{ transform: isLandscape ? "scale(0.52)" : isSquare ? "scale(0.58)" : "scale(0.65)" }}>
            <Logo
              progress={logoIntro}
              ringRotation={logoRotation}
              ringSweepProgress={logoSweep}
              wingFlutterActive={wingActive}
              breatheScale={1.0}
              dissolveProgress={0}
            />
          </div>

          {/* Slogan */}
          <div
            style={{
              marginTop: isLandscape ? 160 : isSquare ? 180 : 230,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: isLandscape ? "64px" : isSquare ? "48px" : "56px",
                color: C.white,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textShadow: "0 0 20px rgba(255,255,255,0.1)",
              }}
            >
              REBUZZ
            </span>
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: isLandscape ? "28px" : isSquare ? "20px" : "24px",
                color: C.orange,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: 6,
                textShadow: "0 0 15px rgba(232,98,10,0.4)",
              }}
            >
              ORDERING
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 2: PAIN & VALUE STATEMENT (1.67s – 4.33s / Frames 50 to 130)       */}
      {/* ========================================================================= */}
      {frame >= 78 && frame < 168 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 12,
          }}
        >
          {/* Block 1: Don't Stress */}
          {frame >= painStart && frame < 125 && (
            <div
              style={{
                display: "flex",
                flexDirection: isLandscape ? "row" : "column",
                alignItems: "center",
                justifyContent: "center",
                gap: isLandscape ? 40 : 20,
                opacity: painOpacity,
                transform: `translateY(${painSlideY}px)`,
                textAlign: "center",
              }}
            >
              <StressIcon progress={painOpacity} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: isLandscape ? "flex-start" : "center" }}>
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: isLandscape ? "108px" : isSquare ? "64px" : "80px",
                    color: C.orange,
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    textShadow: "0 0 35px rgba(232, 98, 10, 0.5)",
                  }}
                >
                  DON'T STRESS.
                </span>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400,
                    fontSize: isLandscape ? "32px" : isSquare ? "22px" : "26px",
                    color: C.white,
                    opacity: 0.8,
                    marginTop: 8,
                  }}
                >
                  Get everything delivered locally.
                </span>
              </div>
            </div>
          )}

          {/* Block 2: Save Your Time */}
          {frame >= valueStart && frame < 168 && (
            <div
              style={{
                display: "flex",
                flexDirection: isLandscape ? "row" : "column",
                alignItems: "center",
                justifyContent: "center",
                gap: isLandscape ? 40 : 20,
                opacity: valueOpacity,
                transform: `translateY(${valueSlideY}px)`,
                textAlign: "center",
              }}
            >
              <ClockIcon progress={valueOpacity} frame={frame} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: isLandscape ? "flex-start" : "center" }}>
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: isLandscape ? "108px" : isSquare ? "64px" : "80px",
                    color: C.orange,
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    textShadow: "0 0 35px rgba(232, 98, 10, 0.5)",
                  }}
                >
                  SAVE YOUR TIME.
                </span>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400,
                    fontSize: isLandscape ? "32px" : isSquare ? "22px" : "26px",
                    color: C.white,
                    opacity: 0.8,
                    marginTop: 8,
                  }}
                >
                  Shop for what you need quickly.
                </span>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ========================================================================= */}
      {/* SCENE 3: SOLUTION - PHONE MOCKUP (4.33s – 7.5s / Frames 130 to 225)       */}
      {/* ========================================================================= */}
      {frame >= 168 && (
        <AbsoluteFill style={{ zIndex: 5 }}>
          {/* Responsive Layout for phone and descriptive tags */}

          {/* 16:9 Landscape Layout */}
          {isLandscape && (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 10%",
                boxSizing: "border-box",
              }}
            >
              {/* Left Column: Phone Mockup */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: phoneOpacity,
                  transform: `translateY(${phoneFinalY}px) translateX(${phoneFinalX}px)`,
                }}
              >
                <PhoneMockup frame={frame} scale={phoneFinalScale} isLandscape={true} />
              </div>

              {/* Right Column: Slogan / Text details (Active during Scene 3) */}
              {frame < 276 && (
                <div
                  style={{
                    flex: 1.2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    opacity: s3TextOpacity,
                    transform: `translateY(${s3TextSlideY}px)`,
                    paddingLeft: 40,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(232,98,10,0.12)",
                      border: `1px solid ${C.orange}`,
                      color: C.orange,
                      padding: "8px 16px",
                      borderRadius: 20,
                      fontSize: "14px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: 20,
                      boxShadow: "0 0 15px rgba(232,98,10,0.15)",
                    }}
                  >
                    Seamless Ordering
                  </span>
                  <h2
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 900,
                      fontSize: "72px",
                      color: C.white,
                      lineHeight: 1.1,
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                    }}
                  >
                    SHOP FOR WHAT YOU NEED{" "}
                    <span style={{ color: C.orange, textShadow: "0 0 30px rgba(232,98,10,0.4)" }}>
                      FROM YOUR PHONE
                    </span>
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "20px",
                      color: C.muted,
                      lineHeight: 1.5,
                      marginTop: 20,
                      maxWidth: 600,
                    }}
                  >
                    Order from local Pokhara favorites like Breaking Bread, Cheese Shop, or Foxys Corner in seconds. Easy tracking, super fast.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 9:16 Portrait / 1:1 Square Layout */}
          {!isLandscape && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "flex-end",
                boxSizing: "border-box",
                paddingBottom: isSquare ? 30 : 60,
              }}
            >
              {/* Top: Tagline / Description (Active during Scene 3) */}
              {frame < 276 && (
                <div
                  style={{
                    position: "absolute",
                    top: isSquare ? 80 : 160,
                    left: 40,
                    right: 40,
                    textAlign: "center",
                    opacity: s3TextOpacity,
                    transform: `translateY(${s3TextSlideY}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 900,
                      fontSize: isSquare ? "46px" : "56px",
                      color: C.white,
                      lineHeight: 1.15,
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      maxWidth: isSquare ? 800 : "100%",
                    }}
                  >
                    SHOP FOR WHAT YOU NEED <br />
                    <span style={{ color: C.orange, textShadow: "0 0 25px rgba(232,98,10,0.4)" }}>
                      FROM YOUR PHONE
                    </span>
                  </span>
                </div>
              )}

              {/* Bottom: Phone Mockup Container */}
              <div
                style={{
                  opacity: phoneOpacity,
                  transform: `translateY(${phoneFinalY}px)`,
                }}
              >
                <PhoneMockup frame={frame} scale={phoneFinalScale} isLandscape={false} />
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ========================================================================= */}
      {/* SCENE 4: CALL TO ACTION (7.5s – 10s / Frames 225 to 300)                  */}
      {/* ========================================================================= */}
      {frame >= 276 && (
        <AbsoluteFill style={{ zIndex: 8 }}>
          {/* 16:9 Landscape CTA Layout */}
          {isLandscape && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                padding: "80px 40px",
              }}
            >
              {/* Outro Headline */}
              <div
                style={{
                  textAlign: "center",
                  opacity: ctaTextOpacity,
                  transform: `translateY(${ctaTextSlideY}px)`,
                  marginBottom: 35,
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: "64px",
                    color: C.white,
                    lineHeight: 1.1,
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  ONE APP. <br />
                  <span style={{ color: C.orange, textShadow: "0 0 30px rgba(232, 98, 10, 0.5)" }}>
                    ENDLESS POSSIBILITIES.
                  </span>
                </h1>
                <div
                  style={{
                    marginTop: 14,
                    height: 3,
                    width: 480,
                    background: `linear-gradient(90deg, transparent, ${C.orange} 20%, ${C.orange} 80%, transparent)`,
                    margin: "12px auto 0 auto",
                    borderRadius: 2,
                    boxShadow: `0 0 10px rgba(232, 98, 10, 0.4)`,
                  }}
                />
              </div>

              {/* QR Code Card */}
              <div
                style={{
                  opacity: ctaOpacity,
                  transform: `scale(${ctaScale}) rotate(${ctaRotate}deg)`,
                  marginBottom: 30,
                  filter: `drop-shadow(0 15px 40px rgba(0,0,0,0.6))`,
                }}
              >
                <QRCodeCard frame={frame} scale={1.05} />
              </div>

              {/* Tagline Instruction */}
              <div
                style={{
                  textAlign: "center",
                  opacity: ctaTextOpacity,
                  transform: `translateY(${ctaTextSlideY}px)`,
                  maxWidth: 600,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "20px",
                    color: C.white,
                    lineHeight: 1.5,
                    opacity: 0.95,
                  }}
                >
                  Scan this QR code to download the{" "}
                  <span style={{ color: C.orange, fontWeight: 700, textShadow: "0 0 12px rgba(232,98,10,0.3)" }}>
                    Rebuzz ordering app
                  </span>
                  .
                </span>
              </div>
            </div>
          )}

          {/* 9:16 Portrait CTA Layout */}
          {!isLandscape && !isSquare && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                padding: "80px 40px",
              }}
            >
              {/* Outro Headline */}
              <div
                style={{
                  textAlign: "center",
                  opacity: ctaTextOpacity,
                  transform: `translateY(${ctaTextSlideY}px)`,
                  marginBottom: 40,
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: "56px",
                    color: C.white,
                    margin: 0,
                    letterSpacing: "0.04em",
                    lineHeight: 1.15,
                    textTransform: "uppercase",
                  }}
                >
                  ONE APP. <br />
                  <span style={{ color: C.orange, textShadow: "0 0 25px rgba(232, 98, 10, 0.6)" }}>
                    ENDLESS POSSIBILITIES.
                  </span>
                </h1>
                <div
                  style={{
                    marginTop: 14,
                    height: 2.5,
                    width: 320,
                    background: `linear-gradient(90deg, transparent, ${C.orange} 20%, ${C.orange} 80%, transparent)`,
                    margin: "12px auto 0 auto",
                    borderRadius: 2,
                    boxShadow: `0 0 10px rgba(232, 98, 10, 0.4)`,
                  }}
                />
              </div>

              {/* QR Code Card */}
              <div
                style={{
                  opacity: ctaOpacity,
                  transform: `scale(${ctaScale}) rotate(${ctaRotate}deg)`,
                  marginBottom: 40,
                  filter: `drop-shadow(0 15px 40px rgba(0,0,0,0.6))`,
                }}
              >
                <QRCodeCard frame={frame} scale={1.05} />
              </div>

              {/* Tagline Instruction */}
              <div
                style={{
                  textAlign: "center",
                  opacity: ctaTextOpacity,
                  transform: `translateY(${ctaTextSlideY}px)`,
                  maxWidth: 550,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "20px",
                    color: C.white,
                    lineHeight: 1.5,
                    opacity: 0.95,
                  }}
                >
                  Scan this QR code to download the <br />
                  <span
                    style={{
                      color: C.orange,
                      fontWeight: 700,
                      textShadow: "0 0 12px rgba(232,98,10,0.3)",
                    }}
                  >
                    Rebuzz ordering app
                  </span>
                  .
                </span>
              </div>
            </div>
          )}

          {/* 1:1 Square CTA Layout */}
          {!isLandscape && isSquare && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                padding: "50px 40px",
              }}
            >
              {/* Outro Headline at the top */}
              <div
                style={{
                  textAlign: "center",
                  opacity: ctaTextOpacity,
                  transform: `translateY(${ctaTextSlideY}px)`,
                  marginBottom: 30,
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: "40px",
                    color: C.white,
                    margin: 0,
                    letterSpacing: "0.04em",
                    lineHeight: 1.15,
                    textTransform: "uppercase",
                  }}
                >
                  ONE APP. <br />
                  <span style={{ color: C.orange, textShadow: "0 0 25px rgba(232, 98, 10, 0.6)" }}>
                    ENDLESS POSSIBILITIES.
                  </span>
                </h1>
                <div
                  style={{
                    marginTop: 10,
                    height: 2.5,
                    width: 320,
                    background: `linear-gradient(90deg, transparent, ${C.orange} 20%, ${C.orange} 80%, transparent)`,
                    margin: "10px auto 0 auto",
                    borderRadius: 2,
                    boxShadow: `0 0 10px rgba(232, 98, 10, 0.4)`,
                  }}
                />
              </div>

              {/* QR Code Card */}
              <div
                style={{
                  opacity: ctaOpacity,
                  transform: `scale(${ctaScale}) rotate(${ctaRotate}deg)`,
                  marginBottom: 30,
                  filter: `drop-shadow(0 15px 30px rgba(0,0,0,0.5))`,
                }}
              >
                <QRCodeCard frame={frame} scale={0.9} />
              </div>

              {/* Tagline Instruction */}
              <div
                style={{
                  textAlign: "center",
                  opacity: ctaTextOpacity,
                  transform: `translateY(${ctaTextSlideY}px)`,
                  maxWidth: 450,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: C.white,
                    lineHeight: 1.4,
                    opacity: 0.95,
                  }}
                >
                  Scan this QR code to download the <br />
                  <span style={{ color: C.orange, fontWeight: 700 }}>
                    Rebuzz app
                  </span>
                  !
                </span>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ========================================================================= */}
      {/* OVERLAYS & SCENE TRANSITIONS                                              */}
      {/* ========================================================================= */}
      {/* Scanline Overlay */}
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
          zIndex: 30,
        }}
      />

      {/* Outro Black Fade transition */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
          opacity: finalFadeOpacity,
          pointerEvents: "none",
          zIndex: 100,
        }}
      />

      {/* ========================================================================= */}
      {/* SYNCHRONIZED AUDIO / SOUND EFFECTS                                        */}
      {/* ========================================================================= */}
      {/* 1. Global Voiceover Audio (runs for the full 412 frames) */}
      <Sequence from={0} durationInFrames={412} name="Voiceover">
        <Audio src={staticFile("VO.wav")} volume={1.0} />
      </Sequence>

      {/* 2. Background Music Audio (starts at 0:07, runs for full 412 frames at low volume) */}
      <Sequence from={0} durationInFrames={412} name="Background Music">
        <Audio src={staticFile("asset/bg.mp3")} volume={0.18} startFrom={210} />
      </Sequence>

      {/* 3. Snapping brackets Whoosh (starts at Frame 0) */}
      <Sequence from={0} durationInFrames={30} name="Brackets Whoosh">
        <Audio src={staticFile("asset/whoosh.wav")} volume={0.35} />
      </Sequence>

      {/* 4. Logo entrance bounce pop (starts at Frame 10) */}
      <Sequence from={10} durationInFrames={35} name="Logo Bounce Pop">
        <Audio src={staticFile("asset/pop.mp3")} volume={0.55} />
      </Sequence>

      {/* 5. Pain statement (Don't Stress) whoosh (starts at Frame 82) */}
      <Sequence from={82} durationInFrames={30} name="Pain Whoosh">
        <Audio src={staticFile("asset/whoosh.wav")} volume={0.4} />
      </Sequence>

      {/* 6. Clock settle ding (starts at Frame 135) */}
      <Sequence from={135} durationInFrames={35} name="Clock Settle Ding">
        <Audio src={staticFile("asset/ding.wav")} volume={0.45} />
      </Sequence>

      {/* 7. Phone rise whoosh (starts at Frame 168) */}
      <Sequence from={168} durationInFrames={30} name="Phone Rise Whoosh">
        <Audio src={staticFile("asset/whoosh.wav")} volume={0.4} />
      </Sequence>

      {/* 8. Phone settle pop (starts at Frame 178) */}
      <Sequence from={178} durationInFrames={30} name="Phone Pop">
        <Audio src={staticFile("asset/pop.mp3")} volume={0.5} />
      </Sequence>

      {/* 9. Restaurant micro-interaction select tap ding (starts at Frame 225) */}
      <Sequence from={225} durationInFrames={35} name="Restaurant Tap Ding">
        <Audio src={staticFile("asset/ding.wav")} volume={0.6} />
      </Sequence>

      {/* 10. QR Code Card entrance pop (starts at Frame 278) */}
      <Sequence from={278} durationInFrames={30} name="QR Card Pop">
        <Audio src={staticFile("asset/pop.mp3")} volume={0.6} />
      </Sequence>

      {/* 11. Outro settle ding (starts at Frame 290) */}
      <Sequence from={290} durationInFrames={40} name="CTA Settle Ding">
        <Audio src={staticFile("asset/ding.wav")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default RebuzzOrderingPromo;
