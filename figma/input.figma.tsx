import figma from "@figma/code-connect";
import { Input } from "../src";

figma.connect(Input, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=62-34", {
  props: {
    label: figma.boolean("show-label", { true: figma.string("field-label"), false: undefined }),
    help: figma.boolean("show-help", { true: figma.string("help-text"), false: undefined }),
    error: figma.boolean("show-error", { true: figma.string("error-text"), false: undefined }),
    placeholder: figma.string("placeholder"),
    disabled: figma.enum("state", { disabled: true }),
  },
  example: (props) => <Input {...props} />,
});
