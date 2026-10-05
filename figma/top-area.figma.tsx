import figma from "@figma/code-connect";
import { TopArea } from "../src";

figma.connect(TopArea, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=135-944", {
  props: { panel: figma.enum("panel", { chat: "chat", produtos: "produtos", "catálogo": "catalogo" }) },
  example: (props) => <TopArea {...props} onPanelChange={() => {}} />,
});
