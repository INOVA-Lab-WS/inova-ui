import figma from "@figma/code-connect";
import { Menu, LogoPlaceholder } from "../src";

figma.connect(Menu, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=620-3967", {
  props: {
    presentation: figma.enum("presentation", { rail: "rail", fullscreen: "fullscreen" }),
    showFooter: figma.boolean("show-footer"),
  },
  example: (props) => <Menu {...props} logo={<LogoPlaceholder />} navigation={null} footer="v0.2.0" />,
});
