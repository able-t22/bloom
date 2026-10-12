// Shapes for the seed -> sprout -> bud -> bloom morph. All live in a 400x400 viewBox.
const CX = 200;
const CY = 215;

// A daisy-like flower: eight rounded petals with soft notches between them.
function flower(petals: number, radius: number, steps = 160) {
 const points: string[] = [];
 for (let i = 0; i < steps; i++) {
  const angle = (i / steps) * Math.PI * 2 - Math.PI / 2;
  const wave = Math.pow(Math.abs(Math.cos((petals / 2) * angle + (petals / 4) * Math.PI)), 0.72);
  const r = radius * (0.56 + 0.44 * wave);
  points.push((i === 0 ? 'M' : 'L') + (CX + Math.cos(angle) * r).toFixed(1) + ' ' + (CY + Math.sin(angle) * r).toFixed(1));
 }
 return points.join(' ') + ' Z';
}

export const GROWTH_PATHS = {
 seed: 'M200 150 C246 150 272 188 267 232 C262 276 230 300 200 300 C170 300 138 276 133 232 C128 188 154 150 200 150 Z',
 sprout: 'M200 312 C196 252 176 196 124 150 C118 218 148 280 200 312 C252 280 282 218 276 150 C224 196 204 252 200 312 Z',
 bud: 'M200 92 C250 152 286 202 271 256 C256 306 226 322 200 322 C174 322 144 306 129 256 C114 202 150 152 200 92 Z',
 bloom: flower(8, 140)
} as const;

export const GROWTH_COLORS = {
 seed: '#a87b55',
 sprout: '#7fa152',
 bud: '#e38b73',
 bloom: '#8e61b9'
} as const;

export const GROWTH_SKIES = ['#e9e1f5', '#e1efcf', '#ffe3d5', '#f9ecb8'] as const;

export const GROWTH_SCALE = [0.82, 0.96, 1.04, 1.12] as const;
