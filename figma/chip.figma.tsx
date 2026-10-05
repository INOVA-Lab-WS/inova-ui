import figma from "@figma/code-connect";
import { Chip } from "../src";

figma.connect(Chip, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=60-28", {
  props: {
    appearance: figma.enum("appearance", { filled: "filled", outline: "outline", ghost: "ghost", ink: "ink", action: "action" }),
    size: figma.enum("size", { small: "small", medium: "medium" }),
    disabled: figma.enum("state", { disabled: true }),
    label: figma.boolean("show-label", { true: figma.string("label"), false: undefined }),
  },
  example: ({ label, ...props }) => <Chip {...props}>{label}</Chip>,
});
