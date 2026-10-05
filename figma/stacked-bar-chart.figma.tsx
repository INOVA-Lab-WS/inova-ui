import figma from "@figma/code-connect";
import { StackedBarChart } from "../src";

figma.connect(StackedBarChart, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=376-2023", {
  example: () => <StackedBarChart label="Por dia" series={["A"]} data={[{ label: "seg", values: [3] }]} />,
});
