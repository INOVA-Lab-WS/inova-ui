import figma from "@figma/code-connect";
import { Code } from "../src";

figma.connect(Code, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=824-875", {
  props: { value: figma.string("value") },
  example: (props) => <Code>{props.value}</Code>,
});
