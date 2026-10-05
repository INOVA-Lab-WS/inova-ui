import figma from "@figma/code-connect";
import { ActionCard } from "../src";

figma.connect(ActionCard, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=192-1221", {
  props: { label: figma.string("label") },
  example: (props) => <ActionCard>{props.label}</ActionCard>,
});
