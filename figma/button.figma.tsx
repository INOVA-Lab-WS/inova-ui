import figma from "@figma/code-connect";
import { Button } from "../src";

figma.connect(Button, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=44-136", {
  props: {
    variant: figma.enum("variant", { primary: "primary", outline: "outline", ghost: "ghost", ink: "ink", destructive: "destructive" }),
    size: figma.enum("viewport", { mobile: "mobile", desktop: "desktop" }),
    iconOnly: figma.boolean("show-label", { true: false, false: true }),
    disabled: figma.enum("state", { disabled: true }),
    label: figma.string("label"),
  },
  example: ({ label, ...props }) => <Button {...props}>{label}</Button>,
});
