import figma from "@figma/code-connect";
import { TableCell } from "../src";

figma.connect(TableCell, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=621-3626", {
  example: () => <TableCell>Valor</TableCell>,
});
