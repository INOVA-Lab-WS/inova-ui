import figma from "@figma/code-connect";
import { ProgressReadout } from "../src";

figma.connect(ProgressReadout, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=315-6571", {
  props: {
    tone: figma.enum("tone", { "on-image": "on-image", "on-surface": "on-surface" }),
    percent: figma.enum("percent", { "0": 0, "10": 10, "20": 20, "30": 30, "40": 40, "50": 50, "60": 60, "70": 70, "80": 80, "90": 90, "100": 100 }),
  },
  example: (props) => <ProgressReadout label="Progresso" percent={props.percent} tone={props.tone} />,
});
