import figma from "@figma/code-connect";
import { LoginForm } from "../src";

figma.connect(LoginForm, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=292-1743", {
  example: () => <LoginForm viewport="mobile" value="" onValueChange={() => {}} onSubmit={() => {}} />,
});
