import figma from "@figma/code-connect";
import { Rating } from "../src";

figma.connect(Rating, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=874-2340", {
  props: {
    size: figma.enum("size", { "20": 20, "16": 16 }),
    disabled: figma.enum("state", { disabled: true }),
    readOnly: figma.enum("state", { "read-only": true }),
    previousValue: figma.enum("state", { previous: 4 }),
  },
  example: (props) => <Rating {...props} label="Pesquisa com usuários" defaultValue={3} />,
});
