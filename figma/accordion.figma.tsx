import figma from "@figma/code-connect";
import { Accordion, AccordionItem } from "../src";

figma.connect(AccordionItem, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=762-3687", {
  props: { disabled: figma.enum("state", { disabled: true }), title: figma.string("title"), subtitle: figma.boolean("show-subtitle", { true: figma.string("subtitle"), false: undefined }) },
  example: (props) => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item" disabled={props.disabled} title={props.title} subtitle={props.subtitle}>
        Conteúdo
      </AccordionItem>
    </Accordion>
  ),
});
