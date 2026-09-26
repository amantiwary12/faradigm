/** "Wind Turbine Pitch Control" -> "wind-turbine-pitch-control" (used for anchors and routes) */
export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
