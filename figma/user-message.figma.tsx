import figma from "@figma/code-connect";
import { UserMessage } from "../src";

figma.connect(UserMessage, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=201-634", {
  props: {},
  example: (props) => <UserMessage>Quero um piso claro para a sala</UserMessage>,
});

// Audio snapshots use the same playback API; only their presentation differs.
figma.connect(UserMessage, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=201-634", {
  variant: { state: "audio-paused" },
  example: () => <UserMessage audio={{ duration: "00:00", onToggle: () => {} }} />,
});

figma.connect(UserMessage, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=201-634", {
  variant: { state: "audio-playing" },
  example: () => <UserMessage audio={{ duration: "00:00", playing: true, onToggle: () => {} }} />,
});

figma.connect(UserMessage, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=201-634", {
  variant: { state: "audio-transcribing" },
  example: () => <UserMessage audio={{ duration: "00:00", transcribing: true }} />,
});
