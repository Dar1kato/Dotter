export const COLORS = [
  { id: 'red',     name: 'Red',     hex: '#e05252' },
  { id: 'orange',  name: 'Orange',  hex: '#e8883a' },
  { id: 'yellow', name: 'Yellow', hex: '#e8cc3a' },
  { id: 'green',    name: 'Green',    hex: '#5dbf5a' },
  { id: 'mint',    name: 'Mint',    hex: '#5ab89e' },
  { id: 'blue',     name: 'Blue',     hex: '#4a90d9' },
  { id: 'purple',   name: 'Purple',   hex: '#9b7fe8' },
  { id: 'pink',     name: 'Pink',     hex: '#d45fa0' },
  { id: 'white',   name: 'White',   hex: '#e8e6e0' },
  { id: 'black',    name: 'Black',    hex: '#3a3b3e' },
];

export const GRID_HALF = 11;      // Radius
export const SPACING   = 34;      // Dot Spacing
export const DOT_R     = 4.5;     // Dot radius (idle)
export const DOT_R_HOV = 6.5;     // Dot radius (hover)
export const CANVAS_SIZE = 800;   // Canvas width and height
export const CENTER = CANVAS_SIZE / 2;


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
