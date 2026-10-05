import figma from "@figma/code-connect";
import { HorizontalBarChart } from "../src";

figma.connect(HorizontalBarChart, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=376-608", {
  example: () => <HorizontalBarChart label="Por loja" data={[{ label: "Loja 1", value: 10 }]} />,
});
