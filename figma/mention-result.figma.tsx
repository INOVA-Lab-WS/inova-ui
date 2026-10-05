import figma from "@figma/code-connect";
import { MentionResult } from "../src";

figma.connect(MentionResult, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=137-810", {
  props: {
    name: figma.string("result-name"),
    description: figma.string("result-metadata"),
    tag: figma.string("result-tag"),
  },
  example: (props) => <MentionResult name={props.name} description={props.description} tag={props.tag} />,
});
