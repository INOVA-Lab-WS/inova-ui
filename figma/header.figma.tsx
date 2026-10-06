import figma from "@figma/code-connect";
import { Header, LogoAmbientAI } from "../src";

figma.connect(Header, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=135-743", {
  props: {
    viewport: figma.enum("viewport", { mobile: "mobile", tablet: "tablet", desktop: "desktop" }),
    menuLabel: figma.string("menu-close-accessible-name"),
  },
  example: (props) => <Header {...props} logo={<LogoAmbientAI type="wordmark" title="Nome do produto" />} />,
});
