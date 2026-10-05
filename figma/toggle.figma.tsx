import figma from "@figma/code-connect";
import { Toggle } from "../src";

figma.connect(Toggle, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=76-62", {
  example: () => <Toggle label="Ativar" />,
});
