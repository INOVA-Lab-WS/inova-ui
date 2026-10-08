import figma from "@figma/code-connect";
import { Thumbnail } from "../src";

figma.connect(Thumbnail, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=200-937", {
  props: {
    caption: figma.string("caption"),
    metadata: figma.string("metadata"),
    unavailable: figma.enum("state", { unavailable: true }),
  },
  // With onClick it renders a native <button type="button"> (pointer, hover border, focus, disabled while unavailable).
  example: (props) => <Thumbnail src="/produto.jpg" caption={props.caption} metadata={props.metadata} unavailable={props.unavailable} onClick={() => {}} />,
});
