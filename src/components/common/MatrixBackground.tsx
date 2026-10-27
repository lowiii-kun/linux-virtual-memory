import { useEffect, useRef } from "react";

// Lightweight canvas "data stream" background: falling hex memory addresses.
export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = "0123456789ABCDEF";
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    };
    window.addEventListener("resize", resize);

    let raf = 0;
    let lastTime = 0;
    const interval = 60; // ms between frames for a slow, calm effect

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (time - lastTime < interval) return;
      lastTime = time;

      ctx.fillStyle = "rgba(10, 15, 28, 0.18)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const gradient = Math.random() > 0.96 ? "#67e8f9" : "rgba(34, 197, 148, 0.45)";
        ctx.fillStyle = gradient;
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.16]"
      aria-hidden="true"
    />
  );
}
