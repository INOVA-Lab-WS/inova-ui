import figma from "@figma/code-connect";
import { Textarea } from "../src";

figma.connect(Textarea, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=680-3517", {
  example: () => <Textarea label="Observações" />,
});
