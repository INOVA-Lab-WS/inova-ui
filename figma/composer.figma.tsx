import figma from "@figma/code-connect";
import { Composer } from "../src";

figma.connect(Composer, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=137-1107", {
  props: { recording: figma.enum("state", { recording: true }) },
  example: (props) => <Composer value="" onValueChange={() => {}} recording={props.recording} levels={Array(24).fill(0.05)} />,
});
