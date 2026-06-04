import React, { useEffect, useRef } from "react";

interface NeuralBackgroundProps {
  className?: string;
  /** Override particle colour. If omitted, reads --accent from the active CSS theme. */
  color?: string;
  /** Opacity of the fade-trail rectangle. Lower = longer trails. Default: 0.12 */
  trailOpacity?: number;
  /** Number of particles. Default: 600 */
  particleCount?: number;
  /** Speed multiplier. Default: 1 */
  speed?: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  if (h.length < 6) return { r: 10, g: 10, b: 12 };
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function readColors(colorProp: string | undefined, trailOpacity: number) {
  const styles = getComputedStyle(document.documentElement);
  const particleColor = colorProp || styles.getPropertyValue("--accent").trim() || "#60a5fa";
  const bgHex = styles.getPropertyValue("--bg").trim() || "#0a0a0c";
  const bg = hexToRgb(bgHex);
  return {
    particleColor,
    trailColor: `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${trailOpacity})`,
  };
}

export default function NeuralBackground({
  className = "",
  color,
  trailOpacity = 0.12,
  particleCount = 600,
  speed = 1,
}: NeuralBackgroundProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Mutable refs so the animation loop always uses current theme colours
  const particleColorRef = useRef<string>("#60a5fa");
  const trailColorRef    = useRef<string>("rgba(10,10,12,0.12)");

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialise colours from current theme
    const initial = readColors(color, trailOpacity);
    particleColorRef.current = initial.particleColor;
    trailColorRef.current    = initial.trailColor;

    // Re-read colours whenever data-theme changes
    const themeObserver = new MutationObserver(() => {
      const updated = readColors(color, trailOpacity);
      particleColorRef.current = updated.particleColor;
      trailColorRef.current    = updated.trailColor;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let width  = container.clientWidth;
    let height = container.clientHeight;
    let animId: number;
    const mouse = { x: -1000, y: -1000 };

    class Particle {
      x = Math.random() * width;
      y = Math.random() * height;
      vx = 0;
      vy = 0;
      age = 0;
      life = Math.random() * 200 + 100;

      update() {
        const angle =
          (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
        this.vx += Math.cos(angle) * 0.2 * speed;
        this.vy += Math.sin(angle) * 0.2 * speed;

        const dx   = mouse.x - this.x;
        const dy   = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const f = (150 - dist) / 150;
          this.vx -= dx * f * 0.05;
          this.vy -= dy * f * 0.05;
        }

        this.x  += this.vx;
        this.y  += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.age++;

        if (this.age > this.life) this.reset();
        if (this.x < 0)      this.x = width;
        if (this.x > width)  this.x = 0;
        if (this.y < 0)      this.y = height;
        if (this.y > height) this.y = 0;
      }

      reset() {
        this.x    = Math.random() * width;
        this.y    = Math.random() * height;
        this.vx   = 0;
        this.vy   = 0;
        this.age  = 0;
        this.life = Math.random() * 200 + 100;
      }

      draw(c: CanvasRenderingContext2D, pColor: string) {
        const alpha = 1 - Math.abs(this.age / this.life - 0.5) * 2;
        c.globalAlpha = alpha;
        c.fillStyle   = pColor;
        c.fillRect(this.x, this.y, 1.5, 1.5);
      }
    }

    let particles: Particle[] = [];

    const init = () => {
      const dpr       = window.devicePixelRatio || 1;
      canvas.width    = width  * dpr;
      canvas.height   = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const animate = () => {
      ctx.fillStyle = trailColorRef.current;
      ctx.fillRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(ctx, particleColorRef.current); });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };

    const onResize = () => {
      width  = container.clientWidth;
      height = container.clientHeight;
      init();
    };

    const onMouseMove = (e: MouseEvent) => {
      const r    = canvas.getBoundingClientRect();
      mouse.x    = e.clientX - r.left;
      mouse.y    = e.clientY - r.top;
    };

    const onMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    init();
    animate();

    window.addEventListener("resize",    onResize);
    container.addEventListener("mousemove",  onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      themeObserver.disconnect();
      window.removeEventListener("resize",    onResize);
      container.removeEventListener("mousemove",  onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [color, trailOpacity, particleCount, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: "var(--bg)" }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
