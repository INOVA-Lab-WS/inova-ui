import figma from "@figma/code-connect";
import { StackedBarChart } from "../src";

const url = "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=376-2023";

figma.connect(StackedBarChart, url, {
  variant: { buckets: "7" },
  props: { state: figma.enum("state", { data: "ready", "tooltip-visible": "ready", empty: "empty" }) },
  example: (props) => <StackedBarChart label="Por dia" state={props.state} series={["A"]} data={[{ label: "seg", values: [3] }]} />,
});

// Many bars (buckets=30): bars shrink to the card and the axis shows every Nth label, first and last always.
// labelStep="auto" is the default; pass a number only to force a step.
figma.connect(StackedBarChart, url, {
  variant: { buckets: "30" },
  example: () => <StackedBarChart label="Imagens geradas por dia" series={["Imagens"]} data={[{ label: "02/09", values: [12] }]} labelStep="auto" />,
});
