import React, { useEffect, useRef, useState } from 'react';

export type BackgroundTheme = 'synapse' | 'aurora' | 'grid';

interface CosmicBackgroundProps {
  theme?: BackgroundTheme;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  theme = 'synapse',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for neural synapse network
    const particleCount = Math.min(45, Math.floor((width * height) / 22000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6',
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let tick = 0;

    const render = () => {
      tick += 0.01;
      ctx.clearRect(0, 0, width, height);

      if (theme === 'grid') {
        // Perspective digital cyber grid
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
        ctx.lineWidth = 1;
        const gridSize = 48;
        const offsetX = (tick * 8) % gridSize;
        const offsetY = (tick * 8) % gridSize;

        for (let x = offsetX; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = offsetY; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else {
        // Synapse Neural Network
        // 1. Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              const alpha = (1 - dist / 130) * 0.2;
              ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // 2. Update and draw nodes
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#0a0e18]">
      {/* Soft Luminous Nebula Orbs */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[130px] animate-pulse-glow" />
      <div
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-violet-600/12 rounded-full blur-[140px] animate-pulse-glow"
        style={{ animationDuration: '6s' }}
      />
      <div
        className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[120px] animate-pulse-glow"
        style={{ animationDuration: '8s' }}
      />

      {/* Interactive Particle Network Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Subtle vignette layer to keep high contrast */}
      <div
        className="absolute inset-0 bg-radial from-transparent via-[#0b0f19]/40 to-[#0b0f19]/90"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, #070b14 100%)',
        }}
      />
    </div>
  );
};
