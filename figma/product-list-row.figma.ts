// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=254-1215
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/product-list-row.tsx
// component=ProductListRow
import figma from 'figma';
const instance = figma.selectedInstance;
const kind = instance.getEnum('kind', { 'catalog-product':'catalog-product', environment:'environment', 'scene-product':'scene-product', 'photo-product':'photo-product', 'paint-hex':'paint-hex', 'paint-fallback':'paint-fallback', 'zone-image':'zone-image', 'zone-hex':'zone-hex', 'zone-color-fallback':'zone-color-fallback', 'zone-covering-fallback':'zone-covering-fallback' });
const category = instance.getString('category-/-' + kind);
const name = instance.getString('name-/-' + kind);
const metadata = instance.getString('metadata-/-' + kind);
const showMetadata = instance.getBoolean('show-metadata-/-' + kind);
const showCopySku = instance.getBoolean('show-copy-sku');
const copySku = instance.getString('copy-sku');
const codeKind = kind === 'catalog-product' ? 'catalog' : 'card';
const iconNode = kind === 'environment' ? instance.findInstance('icon / home') : undefined;
const icon = iconNode?.type === 'INSTANCE' ? iconNode.executeTemplate().example : undefined;
// viewport is a CSS responsive preview. Image URLs and swatch colors require application data.
export default {
 id:'product-list-row', imports:['import { ProductListRow } from "@inova-lab-ws/ui"'],
 example:figma.code`<ProductListRow kind="${codeKind}" category="${category}" name="${name}" ${showMetadata ? figma.code`metadata="${metadata}"` : ''} ${icon ? figma.code`icon={${icon}}` : ''} ${showCopySku ? figma.code`copySku="${copySku}"` : ''} />`,
 metadata:{nestable:true}
};

