import figma from "@figma/code-connect";
import { Alert, Button } from "../src";

figma.connect(Alert, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=675-55", {
  props: {
    tone: figma.enum("tone", { information: "information", success: "success", warning: "warning", error: "error" }),
    title: figma.boolean("show-title", { true: figma.string("title"), false: undefined }),
    message: figma.string("message"),
    action: figma.boolean("show-action", { true: <Button variant="outline" size="desktop">Tentar de novo</Button>, false: undefined }),
  },
  example: ({ message, ...props }) => <Alert {...props}>{message}</Alert>,
});
