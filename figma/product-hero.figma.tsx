import figma from "@figma/code-connect";
import { ProductHero } from "../src";

const url = "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=961-898";

figma.connect(ProductHero, url, {
  variant: { media: "image" },
  props: { category: figma.string("category"), name: figma.string("name"), metadata: figma.string("metadata") },
  example: (props) => <ProductHero src="/produto.jpg" alt="" category={props.category} name={props.name} metadata={props.metadata} />,
});

figma.connect(ProductHero, url, {
  variant: { media: "swatch" },
  props: { category: figma.string("category"), name: figma.string("name"), metadata: figma.string("metadata") },
  example: (props) => <ProductHero swatch="#c8b093" category={props.category} name={props.name} metadata={props.metadata} />,
});
