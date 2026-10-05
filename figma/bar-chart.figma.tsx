import figma from "@figma/code-connect";
import { BarChart } from "../src";

figma.connect(BarChart, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=376-3530", {
  example: () => <BarChart label="Por hora" data={[{ label: "9h", value: 4 }]} />,
});
