import figma from "@figma/code-connect";
import { Badge } from "../src";

figma.connect(Badge, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=59-28", {
  props: {
    color: figma.enum("color", { green: "green", red: "red", yellow: "yellow", blue: "blue", beige: "beige", disabled: "disabled" }),
    tone: figma.enum("tone", { dark: "dark", light: "light" }),
    label: figma.string("label"),
  },
  example: (props) => (
    <Badge color={props.color} tone={props.tone}>
      {props.label}
    </Badge>
  ),
});
