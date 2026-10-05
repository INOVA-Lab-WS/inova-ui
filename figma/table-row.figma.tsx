import figma from "@figma/code-connect";
import { TableRow } from "../src";

figma.connect(TableRow, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=621-3646", {
  example: () => <TableRow />,
});
