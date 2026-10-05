import figma from "@figma/code-connect";
import { Toast } from "../src";

figma.connect(Toast, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=458-124", {
  props: {
    kind: figma.enum("kind", { success: "success", error: "error", info: "info" }),
  },
  example: ({ kind }) => <Toast kind={kind}>Mensagem</Toast>,
});
