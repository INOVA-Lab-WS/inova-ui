import figma from "@figma/code-connect";
import { DateRangePicker } from "../src";

figma.connect(DateRangePicker, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=278-3087", {
  example: () => <DateRangePicker value={null} onValueChange={() => {}} />,
});
