import figma from "@figma/code-connect";
import { ProfileMenu, ActionMenuItem } from "../src";

figma.connect(ProfileMenu, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=790-187", {
  props: {
    name: figma.string("name"),
    email: figma.string("email"),
    // presentation=bottom-sheet in the library; in an app, "responsive" is a bottom sheet below 1024px and a dropdown above.
    presentation: figma.enum("presentation", { popover: "popover", "bottom-sheet": "responsive" }),
  },
  example: (props) => (
    <ProfileMenu name={props.name} email={props.email} presentation={props.presentation} onSignOut={() => {}}>
      <ActionMenuItem>Trocar foto</ActionMenuItem>
    </ProfileMenu>
  ),
});
