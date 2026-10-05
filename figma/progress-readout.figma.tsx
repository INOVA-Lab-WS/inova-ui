import figma from "@figma/code-connect";
import { ProgressReadout } from "../src";

figma.connect(ProgressReadout, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=315-6571", {
  example: () => <ProgressReadout label="Progresso" percent={50} />,
});
