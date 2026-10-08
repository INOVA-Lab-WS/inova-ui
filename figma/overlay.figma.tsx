import figma from "@figma/code-connect";
import { Overlay, Button } from "../src";

figma.connect(Overlay, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=475-135", {
  props: {
    presentation: figma.enum("presentation", { dialog: "dialog", drawer: "drawer", "bottom-sheet": "bottom-sheet" }),
    size: figma.enum("size", { compact: "compact", wide: "wide" }),
  },
  // Bottom sheet footer: actions side by side, equal width (footerLayout="row", default); "column" stacks them.
  // initialFocus (all presentations; bottom sheet since #78) focuses a field on open, e.g. initialFocus={emailRef}.
  example: (props) => (
    <Overlay open onOpenChange={() => {}} presentation={props.presentation} size={props.size} title="Título" footer={<><Button variant="outline">Cancelar</Button><Button>Confirmar</Button></>}>
      Conteúdo
    </Overlay>
  ),
});
