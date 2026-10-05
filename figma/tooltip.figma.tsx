import figma from "@figma/code-connect";
import { Tooltip, Button } from "../src";

figma.connect(Tooltip, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=682-3549", {
  props: {
    text: figma.string("text"),
    placement: figma.enum("arrow", { "top-end": "top-end", "top-center": "top-center", "top-start": "top-start", "bottom-end": "bottom-end", "bottom-center": "bottom-center", "bottom-start": "bottom-start" }),
  },
  example: (props) => (
    <Tooltip {...props}>
      <Button>Passe o mouse</Button>
    </Tooltip>
  ),
});
