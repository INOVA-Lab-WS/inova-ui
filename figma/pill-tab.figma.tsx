import figma from "@figma/code-connect";
import { PillTab, PillTabs } from "../src";

figma.connect(PillTab, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=278-581", {
  props: { selected: figma.enum("state", { selected: true }), label: figma.string("label") },
  example: (props) => <PillTab selected={props.selected}>{props.label}</PillTab>,
});

figma.connect(PillTabs, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=956-4259", {
  props: { fullWidth: figma.enum("width", { hug: false, full: true }) },
  example: (props) => (
    <PillTabs fullWidth={props.fullWidth} aria-label="Idioma">
      <PillTab selected>Português</PillTab>
      <PillTab>English</PillTab>
      <PillTab>Español</PillTab>
    </PillTabs>
  ),
});
