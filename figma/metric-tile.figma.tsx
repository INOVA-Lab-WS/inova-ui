import figma from "@figma/code-connect";
import { MetricTile } from "../src";

figma.connect(MetricTile, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=378-132", {
  example: () => <MetricTile label="Sessões" value={1234} help="Total no período" />,
});
