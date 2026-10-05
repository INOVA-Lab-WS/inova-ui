import figma from "@figma/code-connect";
import { BotAvatar } from "../src";

figma.connect(BotAvatar, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=134-68", {
  props: { size: figma.enum("size", { signature: "signature", welcome: "welcome" }) },
  example: (props) => <BotAvatar {...props} />,
});
