import figma from "@figma/code-connect";
import { ListeningBanner } from "../src";

figma.connect(ListeningBanner, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=137-674", {
  props: {},
  example: (props) => <ListeningBanner />,
});
