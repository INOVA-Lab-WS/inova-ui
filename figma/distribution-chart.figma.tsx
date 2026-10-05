import figma from "@figma/code-connect";
import { DistributionChart } from "../src";

figma.connect(DistributionChart, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=376-4321", {
  example: () => <DistributionChart label="Distribuição" data={[{ label: "A", value: 4 }]} />,
});
