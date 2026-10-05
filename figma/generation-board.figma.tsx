import figma from "@figma/code-connect";
import { GenerationBoard } from "../src";

figma.connect(GenerationBoard, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=169-635", {
  props: {
    emptyTitle: figma.string("empty-title"),
    emptySubtitle: figma.string("empty-subtitle"),
    loadingPhrase: figma.string("loading-phrase"),
  },
  example: (props) => <GenerationBoard emptyTitle={props.emptyTitle} emptySubtitle={props.emptySubtitle} loadingPhrase={props.loadingPhrase} />,
});
