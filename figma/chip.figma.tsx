import figma from "@figma/code-connect";
import { Chip } from "../src";

figma.connect(Chip, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=60-28", {
  props: {
    iconOnly: figma.enum("icon-only", { false: false, true: true }),
    appearance: figma.enum("appearance", { filled: "filled", outline: "outline", ghost: "ghost", ink: "ink", action: "action" }),
    size: figma.enum("size", { small: "small", medium: "medium" }),
    disabled: figma.enum("state", { disabled: true }),
    label: figma.enum("icon-only", { false: figma.string("label"), true: undefined }),
  },
  example: ({ label, ...props }) => <Chip {...props}>{label}</Chip>,
});
