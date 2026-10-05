import figma from "@figma/code-connect";
import { Badge } from "../src";

figma.connect(Badge, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=59-28", {
  props: {
    variant: figma.enum("variant", { default: "default", secondary: "secondary", outline: "outline", muted: "muted", warning: "warning", destructive: "destructive", "native-muted": "native-muted", "native-outline": "native-outline", "native-secondary": "native-secondary", "native-warning": "native-warning" }),
  },
  example: (props) => <Badge {...props}>Badge</Badge>,
});
