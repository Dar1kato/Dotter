export const COLORS = [
  { id: 'rojo',     name: 'Rojo',     hex: '#e05252' },
  { id: 'naranja',  name: 'Naranja',  hex: '#e8883a' },
  { id: 'amarillo', name: 'Amarillo', hex: '#e8cc3a' },
  { id: 'verde',    name: 'Verde',    hex: '#5dbf5a' },
  { id: 'menta',    name: 'Menta',    hex: '#5ab89e' },
  { id: 'azul',     name: 'Azul',     hex: '#4a90d9' },
  { id: 'morado',   name: 'Morado',   hex: '#9b7fe8' },
  { id: 'rosa',     name: 'Rosa',     hex: '#d45fa0' },
  { id: 'blanco',   name: 'Blanco',   hex: '#e8e6e0' },
  { id: 'negro',    name: 'Negro',    hex: '#3a3b3e' },
];

export const GRID_HALF = 6;       // radio en celdas (total: 2*6+1 = 13)
export const SPACING   = 34;      // px entre puntos
export const DOT_R     = 4.5;     // radio del punto en reposo
export const DOT_R_HOV = 6.5;     // radio al hover
export const CANVAS_SIZE = 460;
export const CENTER = CANVAS_SIZE / 2;

/** Genera todos los puntos dentro del disco */
export function generatePoints() {
  const pts = [];
  for (let row = -GRID_HALF; row <= GRID_HALF; row++) {
    for (let col = -GRID_HALF; col <= GRID_HALF; col++) {
      const dist = Math.sqrt(col * col + row * row);
      if (dist <= GRID_HALF + 0.5) {
        pts.push({
          col,
          row,
          x: CENTER + col * SPACING,
          y: CENTER + row * SPACING,
        });
      }
    }
  }
  return pts;
}
