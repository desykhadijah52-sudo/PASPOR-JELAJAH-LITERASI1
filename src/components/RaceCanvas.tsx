import React, { useEffect, useRef } from 'react';

export interface RacerRenderState {
  id: string;
  name: string;
  distance: number; // 0 to 1000
  colorHex: string;
  vehicle: 'kapal' | 'balon' | 'kereta' | 'layar';
  isPlayerHighlight: boolean;
  boostUntilMs: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface RaceCanvasProps {
  racersRef: React.MutableRefObject<RacerRenderState[]>;
  finishDistance: number;
  paused: boolean;
}

export const RaceCanvas: React.FC<RaceCanvasProps> = ({
  racersRef,
  finishDistance,
  paused,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const displayDistances = new Map<string, number>();
    const particles: Particle[] = [];
    const clouds = [
      { x: 0.12, y: 0.14, w: 68, speed: 6 },
      { x: 0.44, y: 0.1, w: 88, speed: 4.5 },
      { x: 0.78, y: 0.16, w: 58, speed: 7 },
    ];

    let animId = 0;
    let lastTime = performance.now();
    let simTime = 0;

    const spawnParticle = (x: number, y: number, color: string, boost: boolean) => {
      if (particles.length > 140) return;
      particles.push({
        x,
        y: y + (Math.random() - 0.5) * 8,
        vx: boost ? -60 - Math.random() * 90 : -22 - Math.random() * 25,
        vy: (Math.random() - 0.5) * (boost ? 48 : 16),
        life: 0,
        maxLife: boost ? 0.45 + Math.random() * 0.25 : 0.35 + Math.random() * 0.2,
        color,
        size: boost ? 3.5 + Math.random() * 2.5 : 2 + Math.random() * 1.5,
      });
    };

    const drawVehicle = (
      x: number,
      y: number,
      racer: RacerRenderState,
      isBoosting: boolean,
      bob: number
    ) => {
      ctx.save();
      ctx.translate(x, y + bob);

      if (isBoosting) {
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 14;
      }

      // Hull / Body
      ctx.fillStyle = racer.colorHex;
      ctx.strokeStyle = racer.isPlayerHighlight ? '#FDE68A' : '#0F172A';
      ctx.lineWidth = racer.isPlayerHighlight ? 2 : 1.5;

      if (racer.vehicle === 'balon') {
        // Airship / Hot-air vessel
        ctx.beginPath();
        ctx.ellipse(0, -6, 14, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(-6, 5, 12, 5);
      } else if (racer.vehicle === 'kereta') {
        // Express bookmobile / railcar
        ctx.beginPath();
        ctx.roundRect(-16, -8, 32, 16, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(-10, -4, 8, 6);
        ctx.fillRect(2, -4, 8, 6);
      } else {
        // Sailboat / Pinisi
        ctx.beginPath();
        ctx.moveTo(-16, 3);
        ctx.lineTo(14, 3);
        ctx.lineTo(18, -3);
        ctx.lineTo(-13, -3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Sail
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.moveTo(-2, -4);
        ctx.lineTo(-2, -19);
        ctx.lineTo(12, -5);
        ctx.closePath();
        ctx.fill();
      }

      // Highlight indicator arrow above active player
      if (racer.isPlayerHighlight) {
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(-4, -28);
        ctx.lineTo(4, -28);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    };

    const render = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);

      if (!pausedRef.current) {
        simTime += dt;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Sky backdrop
      const skyHeight = height * 0.28;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, skyHeight);
      skyGrad.addColorStop(0, '#091424');
      skyGrad.addColorStop(1, '#122B4A');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, skyHeight);

      // Parallax clouds
      ctx.fillStyle = 'rgba(248, 250, 252, 0.1)';
      for (const c of clouds) {
        if (!pausedRef.current) {
          c.x -= (c.speed * dt) / Math.max(width, 400);
          if (c.x < -0.15) c.x = 1.12;
        }
        const cx = c.x * width;
        const cy = c.y * height;
        ctx.beginPath();
        ctx.ellipse(cx, cy, c.w * 0.5, 9, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + c.w * 0.25, cy - 4, c.w * 0.3, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Distant islands silhouette
      ctx.fillStyle = '#0E3A36';
      ctx.beginPath();
      ctx.moveTo(0, skyHeight);
      ctx.quadraticCurveTo(width * 0.2, skyHeight - 18, width * 0.4, skyHeight);
      ctx.quadraticCurveTo(width * 0.65, skyHeight - 24, width * 0.85, skyHeight);
      ctx.lineTo(width, skyHeight);
      ctx.closePath();
      ctx.fill();

      // 2. Race Lanes Area
      const trackTop = skyHeight;
      const trackHeight = height - trackTop;
      const trackGrad = ctx.createLinearGradient(0, trackTop, 0, height);
      trackGrad.addColorStop(0, '#0D253F');
      trackGrad.addColorStop(1, '#08182B');
      ctx.fillStyle = trackGrad;
      ctx.fillRect(0, trackTop, width, trackHeight);

      const startX = Math.max(96, width * 0.11);
      const finishX = width - 48;
      const usableTrackWidth = Math.max(120, finishX - startX);

      // Distance mileposts (250m, 500m, 750m)
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      [0.25, 0.5, 0.75].forEach((ratio) => {
        const mx = startX + usableTrackWidth * ratio;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(mx, trackTop + 4);
        ctx.lineTo(mx, height - 4);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
        ctx.fillText(`${Math.round(finishDistance * ratio)}m`, mx, trackTop + 13);
      });

      // Checkered Finish Line
      const checkerSize = 6;
      const numChecks = Math.ceil(trackHeight / checkerSize);
      for (let i = 0; i < numChecks; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#F8FAFC' : '#0F172A';
        ctx.fillRect(finishX, trackTop + i * checkerSize, checkerSize, checkerSize);
        ctx.fillStyle = i % 2 === 1 ? '#F8FAFC' : '#0F172A';
        ctx.fillRect(finishX + checkerSize, trackTop + i * checkerSize, checkerSize, checkerSize);
      }

      const racers = racersRef.current;
      const laneCount = Math.max(1, racers.length);
      const laneHeight = trackHeight / laneCount;

      // Update & draw lanes + racers
      racers.forEach((racer, idx) => {
        const laneY = trackTop + idx * laneHeight;
        const centerY = laneY + laneHeight * 0.54;

        // Subtle lane divider
        if (idx > 0) {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, laneY);
          ctx.lineTo(width, laneY);
          ctx.stroke();
        }

        // Highlight active lane lightly
        if (racer.isPlayerHighlight) {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.06)';
          ctx.fillRect(0, laneY, width, laneHeight);
        }

        // Smooth distance interpolation
        const prevDisp = displayDistances.get(racer.id) ?? racer.distance;
        const targetDisp = Math.min(finishDistance, Math.max(0, racer.distance));
        const nextDisp = pausedRef.current
          ? prevDisp
          : prevDisp + (targetDisp - prevDisp) * Math.min(1, dt * 8);
        displayDistances.set(racer.id, nextDisp);

        const progress = Math.min(1, nextDisp / finishDistance);
        const racerX = startX + usableTrackWidth * progress;
        const isBoosting = now < racer.boostUntilMs;

        // Lane progress trail
        ctx.fillStyle = `${racer.colorHex}26`;
        ctx.fillRect(startX, centerY - 2, Math.max(0, racerX - startX), 4);

        // Spawn wake or boost sparks
        if (!pausedRef.current && (isBoosting || Math.random() < 0.25)) {
          spawnParticle(
            racerX - 16,
            centerY,
            isBoosting ? '#FBBF24' : 'rgba(186, 230, 253, 0.55)',
            isBoosting
          );
        }

        // Racer label on left side
        ctx.textAlign = 'left';
        ctx.font = racer.isPlayerHighlight
          ? '700 12px "Plus Jakarta Sans", sans-serif'
          : '500 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = racer.isPlayerHighlight ? '#FDE68A' : '#CBD5E1';
        const shortName = racer.name.length > 12 ? racer.name.slice(0, 11) + '…' : racer.name;
        ctx.fillText(shortName, 10, centerY - 2);

        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(`${Math.round(nextDisp)}m`, 10, centerY + 11);

        // Draw vehicle
        const bob = Math.sin(simTime * 5 + idx * 1.4) * 1.8;
        drawVehicle(racerX, centerY, racer, isBoosting, bob);
      });

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!pausedRef.current) {
          p.life += dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        const alpha = 1 - p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.restore();
      animId = window.requestAnimationFrame(render);
    };

    animId = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [finishDistance, racersRef]);

  return (
    <div ref={containerRef} className="w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-slate-700/80 bg-[#08182B]">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
