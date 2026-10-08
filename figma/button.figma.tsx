import figma from "@figma/code-connect";
import { Button } from "../src";

const url = "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=44-136";

figma.connect(Button, url, {
  variant: { size: "default" },
  props: {
    variant: figma.enum("variant", { primary: "primary", outline: "outline", ghost: "ghost", ink: "ink", destructive: "destructive", "destructive-ghost": "destructive-ghost" }),
    size: figma.enum("viewport", { mobile: "mobile", desktop: "desktop" }),
    iconOnly: figma.boolean("show-label", { true: false, false: true }),
    disabled: figma.enum("state", { disabled: true }),
    label: figma.string("label"),
  },
  example: ({ label, ...props }) => <Button {...props}>{label}</Button>,
});

// Green action pill (the input-card "Falar"): 40px on mobile, 32px on desktop, in one responsive size.
figma.connect(Button, url, {
  variant: { variant: "action", size: "compact" },
  props: {
    iconOnly: figma.boolean("show-label", { true: false, false: true }),
    disabled: figma.enum("state", { disabled: true }),
    label: figma.string("label"),
  },
  example: ({ label, ...props }) => (
    <Button variant="action" size="compact" {...props}>
      {label}
    </Button>
  ),
});
