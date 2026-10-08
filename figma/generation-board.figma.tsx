import figma from "@figma/code-connect";
import { GenerationBoard, Chip } from "../src";

figma.connect(GenerationBoard, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=169-635", {
  props: {
    state: figma.enum("state", { empty: "empty", "initial-loading": "loading", ready: "ready", "ready-hover": "ready", regenerating: "regenerating", "previous-crossfade": "ready" }),
    emptyTitle: figma.string("empty-title"),
    emptySubtitle: figma.string("empty-subtitle"),
    loadingPhrase: figma.string("loading-phrase"),
  },
  // onImageClick makes the photo a button (pointer, hover border, focus) that opens the viewer.
  // fit="cover" is the default (the photo fills the stage); fit="contain" shows the whole photo with bands.
  example: (props) => (
    <GenerationBoard state={props.state} fit="cover" onImageClick={() => {}} imageLabel="Ampliar imagem"
      actions={<><Chip appearance="ink" size="medium">Registrar pedido</Chip><Chip appearance="ink" size="medium" iconOnly aria-label="Ver produtos" /><Chip appearance="ink" size="medium" iconOnly aria-label="Baixar" /><Chip appearance="ink" size="medium" iconOnly aria-label="Ampliar" /></>}
      emptyTitle={props.emptyTitle} emptySubtitle={props.emptySubtitle} loadingPhrase={props.loadingPhrase} />
  ),
});
