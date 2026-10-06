import figma from "@figma/code-connect";
import { Alert } from "../src";

figma.connect(Alert, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=675-55", {
  props: {
    tone: figma.enum("tone", { information: "information", success: "success", warning: "warning", error: "error" }),
    title: figma.boolean("show-title", { true: figma.string("title"), false: undefined }),
    message: figma.string("message"),
    actionLabel: figma.boolean("show-action", { true: "Tentar de novo", false: undefined }),
  },
  example: ({ message, ...props }) => <Alert {...props}>{message}</Alert>,
});
