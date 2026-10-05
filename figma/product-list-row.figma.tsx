import figma from "@figma/code-connect";
import { ProductListRow } from "../src";

figma.connect(ProductListRow, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=254-1215", {
  props: {},
  example: (props) => <ProductListRow src="/produto.jpg" category="Piso" name="Porcelanato Madeira" metadata="Marca · LM 123456" />,
});
