import figma from "@figma/code-connect";
import { Table } from "../src";

const url = "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=621-3694";

figma.connect(Table, url, {
  variant: { state: "populated" },
  props: { title: figma.string("title"), note: figma.string("note") },
  example: (props) => <Table title={props.title} note={props.note} />,
});

figma.connect(Table, url, {
  variant: { state: "empty" },
  props: { title: figma.string("title") },
  example: (props) => <Table title={props.title} empty />,
});

// Loading: text bars per column, no circle (tables without an avatar).
figma.connect(Table, url, {
  variant: { state: "loading" },
  props: { title: figma.string("title") },
  example: (props) => <Table title={props.title} busy skeletonRow="text" skeletonColumns={4} />,
});
