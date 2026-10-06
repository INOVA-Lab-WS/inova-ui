import figma from "@figma/code-connect";
import { Menu, LogoPlaceholder, Avatar } from "../src";

figma.connect(Menu, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=620-3967", {
  props: {
    presentation: figma.enum("presentation", { expanded: "expanded", collapsed: "collapsed", "collapsed-hover": "collapsed", fullscreen: "fullscreen" }),
  },
  example: (props) => (
    <Menu {...props} logo={<LogoPlaceholder />} navigation={null} account={<Avatar size="medium" name="Nome da pessoa" />} />
  ),
});
