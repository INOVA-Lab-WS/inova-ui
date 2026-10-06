import figma from "@figma/code-connect";
import { linkClassName } from "../src";

figma.connect("https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=808-170", {
  props: { label: figma.string("label") },
  example: ({ label }) => <a href="#" className={linkClassName()}>{label}</a>,
});
