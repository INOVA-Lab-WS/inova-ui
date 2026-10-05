import figma from "@figma/code-connect";
import { Waveform } from "../src";

figma.connect(Waveform, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=137-599", {
  props: {},
  example: (props) => <Waveform />,
});
