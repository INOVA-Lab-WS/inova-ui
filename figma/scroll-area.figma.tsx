import figma from "@figma/code-connect";
import { ScrollArea } from "../src";

figma.connect(ScrollArea, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=907-1457", {
  props: { orientation: figma.enum("orientation", { vertical: "vertical", horizontal: "horizontal" }) },
  example: (props) => <ScrollArea {...props} className="max-h-60">…</ScrollArea>,
});
