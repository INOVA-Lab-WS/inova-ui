import figma from "@figma/code-connect";
import { CopyField } from "../src";

figma.connect(CopyField, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=762-3752", {
  props: { value: figma.string("value") },
  example: (props) => <CopyField value={props.value} />,
});
