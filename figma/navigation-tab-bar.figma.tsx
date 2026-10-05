import figma from "@figma/code-connect";
import { NavigationTabBar } from "../src";

figma.connect(NavigationTabBar, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=135-641", {
  props: { value: figma.enum("active-tab", { chat: "chat", produtos: "produtos", "catálogo": "catalogo" }) },
  example: (props) => <NavigationTabBar {...props} onValueChange={() => {}} />,
});
