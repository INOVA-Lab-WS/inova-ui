import figma from "@figma/code-connect";
import { InputCard } from "../src";

figma.connect(InputCard, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=137-795", {
  props: { value: figma.string("input-text") },
  example: (props) => <InputCard value={props.value} onValueChange={() => {}} />,
});
