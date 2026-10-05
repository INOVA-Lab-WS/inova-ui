import figma from "@figma/code-connect";
import { ActivityLog } from "../src";

figma.connect(ActivityLog, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=315-6677", {
  example: () => <ActivityLog state="empty" />,
});
