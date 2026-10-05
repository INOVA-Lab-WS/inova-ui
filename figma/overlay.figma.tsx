import figma from "@figma/code-connect";
import { Overlay } from "../src";

figma.connect(Overlay, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=475-135", {
  example: () => <Overlay open onOpenChange={() => {}} presentation="dialog" title="Título">Conteúdo</Overlay>,
});
