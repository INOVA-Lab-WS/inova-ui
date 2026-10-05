import figma from "@figma/code-connect";
import { Checkbox } from "../src";

figma.connect(Checkbox, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=74-50", {
  example: () => <Checkbox label="Opção" />,
});
