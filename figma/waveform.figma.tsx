import figma from "@figma/code-connect";
import { Waveform } from "../src";

const url = "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=137-599";

// mode=live: 24 bars from the microphone levels (0..1).
figma.connect(Waveform, url, {
  variant: { mode: "live" },
  example: () => <Waveform levels={Array(24).fill(0.05)} />,
});

// mode=fallback: 5 pulsing bars, without levels.
figma.connect(Waveform, url, {
  variant: { mode: "fallback" },
  example: () => <Waveform />,
});
