import figma from "@figma/code-connect";
import { SuggestionList } from "../src";

figma.connect(SuggestionList, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=192-1393", {
  props: {},
  example: (props) => <SuggestionList>{/* <ActionCard /> × n */}</SuggestionList>,
});
