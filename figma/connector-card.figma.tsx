import figma from "@figma/code-connect";
import { ConnectorCard } from "../src";

figma.connect(ConnectorCard, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=762-3724", {
  props: { title: figma.string("title"), description: figma.string("description"), metadata: figma.boolean("show-metadata", { true: figma.string("metadata"), false: undefined }) },
  example: (props) => <ConnectorCard href="#" title={props.title} description={props.description} metadata={props.metadata} />,
});
