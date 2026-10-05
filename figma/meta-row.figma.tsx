import figma from "@figma/code-connect";
import { MetaRow } from "../src";

figma.connect(MetaRow, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=134-204", {
  props: { time: figma.string("time") },
  example: (props) => <MetaRow time={props.time} />,
});
