import React, { useRef, useEffect } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from "remotion";

// ─── Brand tokens ───────────────────────────────────────────────────────────
const ORANGE = "#E86B3A";
const NAVY = "#2D4A6B";
const CREAM = "#F5F0E8";

// ─── Glass constants ────────────────────────────────────────────────────────
const GLASS_RADIUS = 200;
const GLASS_BORDER_COLOR = "#111111";
const GLASS_BORDER_WIDTH = 6;
const MAGNIFICATION = 1.4;
const ABERRATION_PX = 7;



// ─── Canvas text helper ─────────────────────────────────────────────────────
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ─── Main Composition ───────────────────────────────────────────────────────
export const ReBuzzSpot: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // SFX asset paths (resolved inside component to avoid module-scope timing issues)
  const sfxWhoosh = staticFile("whoosh.wav");
  const sfxDing = staticFile("ding.wav");

  // ── Scene fade-in (frames 0–25) ────────────────────────────────────────
  const sceneFade = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  // ── Glass pendulum X (figure-8 sweep) ──────────────────────────────────
  const glassX = (() => {
    if (frame <= 40) {
      return interpolate(frame, [0, 40], [340, 740], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      });
    }
    if (frame <= 80) {
      return interpolate(frame, [40, 80], [740, 340], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      });
    }
    return interpolate(frame, [80, 120], [340, 740], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.sin),
    });
  })();

  // ── Glass pendulum Y ───────────────────────────────────────────────────
  const glassY = (() => {
    if (frame <= 40) {
      return interpolate(frame, [0, 40], [860, 900], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      });
    }
    if (frame <= 80) {
      return interpolate(frame, [40, 80], [900, 960], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      });
    }
    return interpolate(frame, [80, 120], [960, 920], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.sin),
    });
  })();

  // ── Stamp: "REBUZZ POS" (frames 80–110) ────────────────────────────────
  const stampOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stampScale = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    from: 1.08,
    to: 1,
    durationInFrames: 30,
  });

  // ── Tagline (frames 95–115) ────────────────────────────────────────────
  const taglineOpacity = interpolate(frame, [95, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Canvas: magnifying glass with refraction ───────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── 1. Build offscreen canvas (entire background scene) ──────────
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const oc = off.getContext("2d");
    if (!oc) return;

    // Cream background
    oc.fillStyle = CREAM;
    oc.fillRect(0, 0, width, height);

    // Main text — replicate React div: Georgia italic bold 72px, navy
    oc.save();
    oc.fillStyle = NAVY;
    oc.font = 'italic 700 72px Georgia, "Times New Roman", serif';
    oc.textAlign = "center";
    oc.textBaseline = "middle";

    const mainText =
      "Caffeine Corner is using ReBuzz POS. When will you?";
    const lines = wrapCanvasText(oc, mainText, 780);
    const lh = 72 * 1.45; // line-height matches CSS
    const blockH = lines.length * lh;
    const baseY = height / 2 - blockH / 2 + lh / 2;

    for (let i = 0; i < lines.length; i++) {
      oc.fillText(lines[i], width / 2, baseY + i * lh);
    }
    oc.restore();

    // Stamp text (for magnification if glass overlaps)
    if (frame >= 80) {
      oc.save();
      oc.globalAlpha = stampOpacity;
      oc.fillStyle = ORANGE;
      oc.font = 'bold 96px Georgia, "Times New Roman", serif';
      oc.textAlign = "center";
      oc.textBaseline = "middle";
      oc.translate(width / 2, height - 170);
      oc.scale(stampScale, stampScale);
      oc.fillText("REBUZZ POS", 0, 0);
      oc.restore();
    }

    // Tagline
    if (frame >= 95) {
      oc.save();
      oc.globalAlpha = taglineOpacity;
      oc.fillStyle = NAVY;
      oc.font = '400 24px Georgia, "Times New Roman", serif';
      oc.textAlign = "center";
      oc.textBaseline = "middle";
      oc.fillText("CLICK. BUZZ. SOLD.", width / 2, height - 70);
      oc.restore();
    }

    // ── 2. Clear main canvas ─────────────────────────────────────────
    ctx.clearRect(0, 0, width, height);

    // Destination rectangle for magnified draws
    const dx = glassX - GLASS_RADIUS;
    const dy = glassY - GLASS_RADIUS;
    const dw = GLASS_RADIUS * 2;
    const dh = GLASS_RADIUS * 2;

    // Source rectangle (1.4× magnification centered on glass)
    const sx = glassX - GLASS_RADIUS / MAGNIFICATION;
    const sy = glassY - GLASS_RADIUS / MAGNIFICATION;
    const sw = (GLASS_RADIUS * 2) / MAGNIFICATION;
    const sh = (GLASS_RADIUS * 2) / MAGNIFICATION;

    // ── 3. Clip to circle, draw magnified content ────────────────────
    ctx.save();
    ctx.beginPath();
    ctx.arc(glassX, glassY, GLASS_RADIUS, 0, Math.PI * 2);
    ctx.clip();

    // Base magnified draw
    ctx.drawImage(off, sx, sy, sw, sh, dx, dy, dw, dh);

    // ── 4. Chromatic aberration ──────────────────────────────────────
    // Red channel: +7px horizontal
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.35;
    ctx.drawImage(off, sx, sy, sw, sh, dx + ABERRATION_PX, dy, dw, dh);
    ctx.restore();

    // Blue channel: -7px horizontal
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.35;
    ctx.drawImage(off, sx, sy, sw, sh, dx - ABERRATION_PX, dy, dw, dh);
    ctx.restore();

    // Reset composite mode
    ctx.globalCompositeOperation = "source-over";

    // ── 5. Lens sheen (radial gradient inside clip) ──────────────────
    const sheen = ctx.createRadialGradient(
      glassX,
      glassY,
      0,
      glassX,
      glassY,
      GLASS_RADIUS
    );
    sheen.addColorStop(0, "rgba(255,255,255,0.18)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(dx, dy, dw, dh);

    // ── 6. Restore clip ──────────────────────────────────────────────
    ctx.restore();

    // ── 7. Outer ring: 6px #111111 ───────────────────────────────────
    ctx.beginPath();
    ctx.arc(glassX, glassY, GLASS_RADIUS, 0, Math.PI * 2);
    ctx.lineWidth = GLASS_BORDER_WIDTH;
    ctx.strokeStyle = GLASS_BORDER_COLOR;
    ctx.stroke();

    // ── 8. Inner highlight ring ──────────────────────────────────────
    ctx.beginPath();
    ctx.arc(glassX, glassY, GLASS_RADIUS - 3, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.stroke();
  }, [
    frame,
    width,
    height,
    fps,
    glassX,
    glassY,
    stampOpacity,
    stampScale,
    taglineOpacity,
  ]);

  // ── JSX layer ──────────────────────────────────────────────────────────
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM, opacity: sceneFade }}>
      {/* ── Main text (React div, centered) ───────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 72,
            color: NAVY,
            textAlign: "center",
            maxWidth: 780,
            lineHeight: 1.45,
          }}
        >
          Caffeine Corner is using ReBuzz POS. When will you?
        </div>
      </div>

      {/* ── Stamp: REBUZZ POS (bottom center, 120px up) ───────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: stampOpacity,
          transform: `scale(${stampScale})`,
          transformOrigin: "center center",
        }}
      >
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 700,
            fontSize: 96,
            color: ORANGE,
          }}
        >
          REBUZZ POS
        </span>
      </div>

      {/* ── Tagline: CLICK. BUZZ. SOLD. ───────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: taglineOpacity,
        }}
      >
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 400,
            fontSize: 24,
            color: NAVY,
          }}
        >
          CLICK. BUZZ. SOLD.
        </span>
      </div>

      {/* ── Canvas: magnifying glass (above text divs) ────────────── */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* ── SFX ───────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={120} layout="none">
        <Audio src={sfxWhoosh} volume={0.5} />
      </Sequence>
      <Sequence from={80} durationInFrames={30} layout="none">
        <Audio src={sfxDing} volume={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};
