import figma from "@figma/code-connect";
import { Avatar } from "../src";

figma.connect(Avatar, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=61-28", {
  props: {
    size: figma.enum("size", { small: "small", medium: "medium", large: "large" }),
    name: figma.enum("variant", { initial: "Gabriel", icon: undefined }),
  },
  example: (props) => <Avatar {...props} />,
});
