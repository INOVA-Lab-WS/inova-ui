import figma from "@figma/code-connect";
import { FeedbackPrompt } from "../src";

figma.connect(FeedbackPrompt, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=169-710", {
  props: { prompt: figma.string("prompt") },
  example: (props) => <FeedbackPrompt prompt={props.prompt} onOpen={() => {}} onDismiss={() => {}} />,
});
