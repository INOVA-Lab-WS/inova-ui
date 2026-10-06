import figma from "@figma/code-connect";
import { Slider } from "../src";

figma.connect(Slider, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=889-2256", {
  props: { disabled: figma.enum("state", { disabled: true }) },
  example: (props) => <Slider {...props} label="Progresso da meta" min={0} max={100} step={5} defaultValue={45} formatValue={(v) => `${v}%`} />,
});
