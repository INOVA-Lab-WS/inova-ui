import figma from "@figma/code-connect";
import { Skeleton } from "../src";

figma.connect(Skeleton, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=887-236", {
  props: { shape: figma.enum("shape", { rect: "rect", text: "text", circle: "circle" }) },
  example: (props) => <Skeleton {...props} className="h-24 w-40" />,
});
