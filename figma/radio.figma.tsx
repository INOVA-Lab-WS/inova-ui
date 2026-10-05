import figma from "@figma/code-connect";
import { Radio } from "../src";

figma.connect(Radio, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=76-38", {
  example: () => <Radio name="grupo" label="Opção" />,
});
