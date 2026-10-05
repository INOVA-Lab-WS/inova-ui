import figma from "@figma/code-connect";
import { Divider } from "../src";

figma.connect(Divider, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=134-151", {
  example: () => <Divider />,
});
