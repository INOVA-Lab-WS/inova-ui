import figma from "@figma/code-connect";
import { ActivityLogRow } from "../src";

figma.connect(ActivityLogRow, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=315-6614", {
  example: () => <ActivityLogRow time="10:42" author="Ana" action="editou o texto" />,
});
