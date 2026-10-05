import figma from "@figma/code-connect";
import { PillTab } from "../src";

figma.connect(PillTab, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=278-581", {
  example: () => <PillTab selected>Aba</PillTab>,
});
