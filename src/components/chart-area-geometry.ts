/** Invalid numeric samples are gaps, never silently converted to zero. */
export function measured(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export interface AreaPoint { x: number; y: number; index: number; value: number }

/** Split both stroke and fill at every missing sample. Singletons render as dots. */
export function areaSegments(values: (number | null | undefined)[], low: number, high: number): AreaPoint[][] {
  const segments: AreaPoint[][] = [];
  let segment: AreaPoint[] = [];
  values.forEach((value, index) => {
    if (!measured(value)) {
      if (segment.length) segments.push(segment);
      segment = [];
      return;
    }
    segment.push({ x: values.length === 1 ? 50 : index / (values.length - 1) * 100, y: 100 - (value - low) / (high - low) * 100, index, value });
  });
  if (segment.length) segments.push(segment);
  return segments;
}

export function linePath(points: AreaPoint[]) { return points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" "); }
export function areaPath(points: AreaPoint[], baseline: number) {
  return `${linePath(points)} L${points[points.length - 1].x},${baseline} L${points[0].x},${baseline} Z`;
}

export interface AreaRangeDatum { projected?: boolean; low?: number | null; high?: number | null }
/** A probable interval is valid independently of its center value; either missing bound splits the polygon. */
export function rangeSegments(data: AreaRangeDatum[], low: number, high: number): { lower: AreaPoint[]; upper: AreaPoint[] }[] {
  const lower = areaSegments(data.map(d => d.projected && measured(d.low) && measured(d.high) && d.low <= d.high ? d.low : null), low, high);
  const upper = areaSegments(data.map(d => d.projected && measured(d.low) && measured(d.high) && d.low <= d.high ? d.high : null), low, high);
  return lower.map((points, index) => ({ lower: points, upper: upper[index] }));
}
export function rangePath(segment: { lower: AreaPoint[]; upper: AreaPoint[] }) {
  return `${linePath(segment.upper)} ${segment.lower.slice().reverse().map(p => `L${p.x},${p.y}`).join(" ")} Z`;
}
