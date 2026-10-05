import figma from "@figma/code-connect";
import { Table } from "../src";

figma.connect(Table, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=621-3694", {
  example: () => <Table />,
});
