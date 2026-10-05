import figma from "@figma/code-connect";
import { HistoryThumbnail } from "../src";

figma.connect(HistoryThumbnail, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=169-514", {
  props: {
    label: figma.string("label"),
    selected: figma.enum("state", { selected: true }),
    pending: figma.enum("state", { pending: true }),
    kind: figma.enum("state", {
      inactive: "image", selected: "image", hover: "image", pending: "image",
      "generate-empty": "generate", "generate-empty-hover": "generate",
      "generate-warm": "generate", "generate-warm-hover": "generate",
      "generate-cold": "generate", "generate-cold-hover": "generate",
    }),
  },
  example: (props) => <HistoryThumbnail kind={props.kind} selected={props.selected} pending={props.pending} label={props.label} src="/render.jpg" />,
});
