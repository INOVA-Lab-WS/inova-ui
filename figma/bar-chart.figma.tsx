import figma from "@figma/code-connect";
import { BarChart } from "../src";

figma.connect(BarChart, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=376-3530", {
  props: { state: figma.enum("state", { data: "ready", "tooltip-visible": "ready", empty: "empty", loading: "loading" }) },
  example: (props) => <BarChart label="Por hora" state={props.state} data={[{ label: "9h", value: 4 }]} />,
});
