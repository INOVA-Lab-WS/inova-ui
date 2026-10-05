import figma from "@figma/code-connect";
import { PageHeader, Button, Chip } from "../src";

figma.connect(PageHeader, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=763-516", {
  props: { title: figma.string("title"), description: figma.string("subtitle") },
  example: (props) => (
    <PageHeader
      title={props.title}
      description={props.description}
      action={<Button>Ação</Button>}
      tabs={
        <>
          <Chip appearance="filled" count={24}>Aba</Chip>
          <Chip appearance="ghost" count={8}>Aba</Chip>
        </>
      }
    />
  ),
});
