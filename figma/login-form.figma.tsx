import figma from "@figma/code-connect";
import { LoginForm } from "../src";

const url = "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=292-1743";

figma.connect(LoginForm, url, {
  props: { viewport: figma.enum("viewport", { mobile: "mobile", desktop: "desktop" }) },
  example: (props) => <LoginForm viewport={props.viewport} value="" onValueChange={() => {}} onSubmit={() => {}} />,
});

// state=identity (#93): the verified person replaces the field; the button keeps its place.
figma.connect(LoginForm, url, {
  variant: { state: "identity" },
  props: { viewport: figma.enum("viewport", { mobile: "mobile", desktop: "desktop" }) },
  example: (props) => (
    <LoginForm
      viewport={props.viewport}
      identity={{ name: "Gabriel Macedo", email: "gabriel.macedo@leroymerlin.com.br", avatarSrc: undefined }}
      submitLabel="Entrar"
      onSubmit={() => {}}
    />
  ),
});
