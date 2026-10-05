import figma from "@figma/code-connect";
import { ActionMenu, ActionMenuTrigger, ActionMenuContent, ActionMenuItem, ActionMenuSeparator } from "../src";

figma.connect(ActionMenuItem, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=763-122", {
  props: { label: figma.string("label"), tone: figma.enum("tone", { default: "default", danger: "danger" }), disabled: figma.enum("state", { disabled: true }) },
  example: (props) => (
    <ActionMenuItem tone={props.tone} disabled={props.disabled}>
      {props.label}
    </ActionMenuItem>
  ),
});

figma.connect(ActionMenuContent, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=763-123", {
  example: () => (
    <ActionMenu>
      <ActionMenuTrigger aria-label="Mais ações" />
      <ActionMenuContent>
        <ActionMenuItem>Ação</ActionMenuItem>
        <ActionMenuSeparator />
        <ActionMenuItem tone="danger">Ação destrutiva</ActionMenuItem>
      </ActionMenuContent>
    </ActionMenu>
  ),
});
