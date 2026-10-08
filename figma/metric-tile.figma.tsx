import figma from "@figma/code-connect";
import { MetricTile } from "../src";

const url = "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=378-132";

figma.connect(MetricTile, url, {
  variant: { layout: "stat" },
  example: () => <MetricTile label="Sessões" value={1234} help="Total no período" />,
});

// layout=variant: show-marker off is marker={false} (the scene-tile look without the dot).
figma.connect(MetricTile, url, {
  variant: { layout: "variant" },
  props: { marker: figma.boolean("show-marker-[layout=variant]") },
  example: (props) => <MetricTile layout="variant" label="Total" value={12} caption="12%" marker={props.marker} />,
});

figma.connect(MetricTile, url, {
  variant: { layout: "count" },
  example: () => <MetricTile layout="count" label="Pessoas" value={8} />,
});
