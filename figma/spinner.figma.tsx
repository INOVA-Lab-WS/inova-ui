import figma from "@figma/code-connect";
import { Spinner } from "../src";

figma.connect(Spinner, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=72-27", {
  props: { size: figma.enum("size", { small: "small", medium: "medium", big: "big" }) },
  example: (props) => <Spinner {...props} />,
});
