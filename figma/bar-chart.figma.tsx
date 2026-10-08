import figma from "@figma/code-connect";
import { BarChart } from "../src";

figma.connect(BarChart, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=376-3530", {
  props: { state: figma.enum("state", { data: "ready", "tooltip-visible": "ready", empty: "empty", loading: "loading" }) },
  // state=tooltip-visible is the hover/focus of a bar: built in (#77); valueLabel names the value in the tooltip.
  // labelStep="auto" (default): with 24 hours the axis thins out (0h, 3h, 6h… 23h) so no label is cut.
  example: (props) => <BarChart label="Por hora" state={props.state} data={[{ label: "9h", value: 4 }]} labelStep="auto" valueLabel="Sessões" />,
});
