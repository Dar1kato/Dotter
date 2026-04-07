import { useRef, useEffect, useCallback } from 'react';
import {
  generatePoints, CANVAS_SIZE, SPACING, DOT_R, DOT_R_HOV, CENTER, GRID_HALF,
} from '../constants';

const POINTS = generatePoints();
const DOT_IDLE  = '#2a2b2e';
const DOT_HOVER = '#3d3f44';
const DISC_BG   = '#111214';

function getPointAt(mx, my) {
  let closest = null, minDist = Infinity;
  for (const pt of POINTS) {
    const d = Math.hypot(mx - pt.x, my - pt.y);
    if (d < minDist) { minDist = d; closest = pt; }
  }
  return minDist < SPACING * 0.62 ? closest : null;
}

export default function PetriCanvas({ painted, onPaint, erasing }) {
  const canvasRef = useRef(null);
  const hoverRef  = useRef(null);
  const isDown    = useRef(false);
  const raf       = useRef(null);
  const dirty     = useRef(true);

  // Dibuja todos los puntos
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo circular tipo disco petri
    ctx.save();
    ctx.beginPath();
    ctx.arc(CENTER * dpr, CENTER * dpr, (GRID_HALF * SPACING + 28) * dpr, 0, Math.PI * 2);
    ctx.fillStyle = DISC_BG;
    ctx.fill();

    // Anillo sutil
    ctx.strokeStyle = '#1f2022';
    ctx.lineWidth = 1.5 * dpr;
    ctx.stroke();
    ctx.restore();

    // Puntos
    for (const pt of POINTS) {
      const key = `${pt.col},${pt.row}`;
      const isHovered = hoverRef.current?.col === pt.col && hoverRef.current?.row === pt.row;
      const color = painted[key] || null;
      const r = (isHovered ? DOT_R_HOV : DOT_R) * dpr;

      ctx.beginPath();
      ctx.arc(pt.x * dpr, pt.y * dpr, r, 0, Math.PI * 2);

      if (color) {
        ctx.fillStyle = color;
        if (isHovered) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 8 * dpr;
        }
      } else {
        ctx.fillStyle = isHovered ? DOT_HOVER : DOT_IDLE;
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    dirty.current = false;
  }, [painted]);

  // Loop de animación
  useEffect(() => {
    const loop = () => {
      if (dirty.current) render();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [render]);

  // Escalar canvas para DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width  = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    dirty.current = true;
  }, []);

  useEffect(() => { dirty.current = true; }, [painted]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      mx: (clientX - rect.left) * (CANVAS_SIZE / rect.width),
      my: (clientY - rect.top)  * (CANVAS_SIZE / rect.height),
    };
  };

  const handleInteract = useCallback((e) => {
    const { mx, my } = getCoords(e);
    const pt = getPointAt(mx, my);
    if (pt) onPaint(pt, erasing);
  }, [onPaint, erasing]);

  const handleMove = useCallback((e) => {
    const { mx, my } = getCoords(e);
    const pt = getPointAt(mx, my);
    const prev = hoverRef.current;
    if (pt?.col !== prev?.col || pt?.row !== prev?.row) {
      hoverRef.current = pt || null;
      dirty.current = true;
    }
    if (isDown.current) handleInteract(e);
  }, [handleInteract]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        cursor: erasing ? 'cell' : 'crosshair',
        borderRadius: '50%',
        display: 'block',
      }}
      onMouseDown={(e) => { isDown.current = true; handleInteract(e); }}
      onMouseMove={handleMove}
      onMouseUp={() => { isDown.current = false; }}
      onMouseLeave={() => { isDown.current = false; hoverRef.current = null; dirty.current = true; }}
      onTouchStart={(e) => { e.preventDefault(); isDown.current = true; handleInteract(e); }}
      onTouchMove={(e) => { e.preventDefault(); handleMove(e); }}
      onTouchEnd={() => { isDown.current = false; }}
    />
  );
}
