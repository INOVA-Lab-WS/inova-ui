import figma from "@figma/code-connect";
import { RoleRadio } from "../src";

figma.connect(RoleRadio, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=278-626", {
  example: () => <RoleRadio name="papel" options={[{ value: "a", label: "Opção A" }]} value="a" onValueChange={() => {}} />,
});
