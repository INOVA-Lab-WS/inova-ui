import figma from "@figma/code-connect";
import { Card } from "../src";

figma.connect(Card, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=803-383", {
  props: { interactive: figma.enum("state", { hover: true, focus: true }) },
  example: (props) => <Card interactive={props.interactive}>Conteúdo</Card>,
});
