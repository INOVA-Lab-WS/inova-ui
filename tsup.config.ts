import { defineConfig } from "tsup";
// index: the components, marked "use client". variants: style functions only, safe on the server.
export default defineConfig([
  { entry: ["src/index.ts"], format: ["esm"], dts: true, clean: true, external: ["react", "react-dom"], banner: { js: '"use client";' } },
  { entry: ["src/variants.ts"], format: ["esm"], dts: true, external: ["react", "react-dom"] },
]);
