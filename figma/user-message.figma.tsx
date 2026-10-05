import figma from "@figma/code-connect";
import { UserMessage } from "../src";

figma.connect(UserMessage, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=201-634", {
  props: {},
  example: (props) => <UserMessage>Quero um piso claro para a sala</UserMessage>,
});
