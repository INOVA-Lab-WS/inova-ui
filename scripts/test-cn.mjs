// cn must know the theme's names (#61): run after build.
import { cn } from "../dist/index.js";
const cases = [
  ["text-text-muted text-chart-axis", "text-text-muted text-chart-axis"],
  ["rounded-8 rounded-pill", "rounded-pill"],
  ["rounded-lg rounded-12", "rounded-12"],
  ["shadow-control shadow-raised", "shadow-raised"],
  ["z-header z-overlay", "z-overlay"],
  ["text-sm text-base", "text-base"],
];
let failed = 0;
for (const [input, expected] of cases) {
  const got = cn(input);
  if (got !== expected) {
    failed++;
    console.error(`cn(${JSON.stringify(input)}) = ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
  }
}
if (failed) process.exit(1);
console.log(`cn: ${cases.length} cases ok`);
