import figma from "@figma/code-connect";
import { AssistantMessage } from "../src";

figma.connect(AssistantMessage, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=209-4553", {
  props: {},
  example: (props) => <AssistantMessage>Pronto, aqui está o ambiente.</AssistantMessage>,
});
