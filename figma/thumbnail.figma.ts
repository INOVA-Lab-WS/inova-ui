// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=200-937
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/thumbnail.tsx
// component=Thumbnail
import figma from 'figma';
const instance = figma.selectedInstance;
const caption = instance.getString('caption');
const metadata = instance.getString('metadata');
const fallback = instance.getString('fallback');
const showCaption = instance.getBoolean('show-caption');
const showMetadata = instance.getBoolean('show-metadata');
const state = instance.getEnum('state', { default:'default', hover:'hover', unavailable:'unavailable', filled:'filled', empty:'empty' });
const composition = instance.getEnum('composition', {basic:'basic',rich:'rich'});
const viewport = instance.getEnum('viewport', {desktop:'desktop',mobile:'mobile'});
const rich = composition === 'rich';
const badge = rich ? instance.getSlot(viewport === 'mobile' ? 'badge#1122:6' : 'badge#1122:64') : undefined;
const overlayAction = rich ? instance.getSlot(viewport === 'mobile' ? 'overlayAction#1122:18' : 'overlayAction#1122:77') : undefined;
const author = rich ? instance.getSlot(viewport === 'mobile' ? 'author#1122:30' : 'author#1122:90') : undefined;
const footer = rich ? instance.getSlot(viewport === 'mobile' ? 'footer#1122:42' : 'footer#1122:103') : undefined;
// content and viewport are native media/responsive previews. Image URLs and swatch colors belong to application data.
// focused/hover are interaction previews, not controllable Thumbnail props.
export default {
 id:'thumbnail', imports:['import { Thumbnail } from "@inova-lab-ws/ui"'],
 example:figma.code`<Thumbnail ${showCaption ? figma.code`caption="${caption}"` : ''} ${showMetadata ? figma.code`metadata="${metadata}"` : ''} fallback="${fallback}" ${state === 'unavailable' ? 'unavailable' : ''} ${rich ? figma.code`badge={<>${badge}</>} overlayAction={<>${overlayAction}</>} author={<>${author}</>} footer={<>${footer}</>}` : ''} />`,
 metadata:{nestable:true}
};

