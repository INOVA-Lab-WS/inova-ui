import figma from "@figma/code-connect";
import { LogoAmbientAI, LogoGate, LogoFormaLab, LogoInovaUI, LogoPlaceholder } from "../src";

figma.connect(LogoAmbientAI, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=99-199", {
  props: { type: figma.enum("type", { symbol: "symbol", wordmark: "wordmark", mark: "mark" }), color: figma.enum("color", { black: "black", green: "green", white: "white" }) },
  example: (props) => <LogoAmbientAI {...props} title="AmbientAI" />,
});

figma.connect(LogoGate, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=720-22", {
  props: { type: figma.enum("type", { symbol: "symbol", wordmark: "wordmark", mark: "mark" }), color: figma.enum("color", { black: "black", green: "green", white: "white" }) },
  example: (props) => <LogoGate {...props} title="Gate" />,
});

figma.connect(LogoFormaLab, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=722-28", {
  props: { type: figma.enum("type", { symbol: "symbol", wordmark: "wordmark", mark: "mark" }), color: figma.enum("color", { lime: "lime", black: "black", white: "white" }) },
  example: (props) => <LogoFormaLab {...props} title="Forma Lab" />,
});

figma.connect(LogoInovaUI, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=736-8302", {
  example: () => <LogoInovaUI title="INOVA UI" />,
});

figma.connect(LogoPlaceholder, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=621-3805", {
  example: () => <LogoPlaceholder />,
});
