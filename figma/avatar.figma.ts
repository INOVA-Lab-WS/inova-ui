// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=61-28
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/avatar.tsx
// component=Avatar
import figma from 'figma';
const instance = figma.selectedInstance;
const size = instance.getEnum('size', { small:'small', medium:'medium', large:'large' });
const variant = instance.getEnum('variant', { initial:'initial', icon:'icon', app:'app', photo:'photo', logo:'logo' });
const initial = instance.getString('inicial');
const codeVariant = variant === 'app' ? 'app' : variant === 'logo' ? 'logo' : 'person';
const iconNode = variant === 'icon' ? instance.getInstanceSwap('icon') : variant === 'app' || variant === 'logo' ? instance.findInstance('fallback-icon') : undefined;
const icon = iconNode?.type === 'INSTANCE' ? iconNode.executeTemplate().example : undefined;
// Photo/logo URLs are application data; the native previews have no URL property.
// For brand SVGs, tightly crop the viewBox; contain cannot remove internal SVG whitespace.
export default {
 id:'avatar', imports:['import { Avatar } from "@inova-lab-ws/ui"'],
 example:figma.code`<Avatar size="${size}" variant="${codeVariant}" ${variant === 'initial' || variant === 'photo' ? figma.code`name="${initial}"` : ''} ${icon ? figma.code`icon={${icon}}` : ''} />`,
 metadata:{nestable:true}
};

