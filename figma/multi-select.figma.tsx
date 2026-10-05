import figma from "@figma/code-connect";
import { MultiSelect } from "../src";

figma.connect(MultiSelect, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=278-1167", {
  example: () => <MultiSelect options={[{ value: "a", label: "Opção A" }]} value={[]} onValueChange={() => {}} searchable />,
});
