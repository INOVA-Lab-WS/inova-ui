import figma from "@figma/code-connect";
import { EmptyState, Button } from "../src";

figma.connect(EmptyState, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=907-790", {
  props: {
    size: figma.enum("size", { compact: "compact", page: "page" }),
    title: figma.string("title"),
    description: figma.boolean("show-description", { true: figma.string("description"), false: undefined }),
    action: figma.boolean("show-action", { true: <Button variant="outline" size="desktop">Limpar filtros</Button>, false: undefined }),
  },
  example: (props) => <EmptyState {...props} />,
});
