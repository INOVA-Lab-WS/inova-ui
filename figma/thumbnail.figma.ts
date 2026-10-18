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
const state = instance.getEnum('state', { default:'default', hover:'hover', unavailable:'unavailable', filled:'filled', empty:'empty', 'fallback-image':'fallback-image' });
const composition = instance.getEnum('composition', {basic:'basic',rich:'rich'});
const viewport = instance.getEnum('viewport', {desktop:'desktop',mobile:'mobile'});
const appearance = instance.getEnum('appearance', {default:'default',frameless:'frameless'});
const size = instance.getEnum('size', {default:'default',compact:'compact'});
const aspectRatio = instance.getEnum('aspect-ratio', {'1:1':'1:1','4:3':'4:3'});
const rich = composition === 'rich';
const compactRich = rich && appearance === 'frameless' && size === 'compact' && aspectRatio === '4:3';
// Each native rich specimen owns distinct SLOT keys; resolve the selected specimen exactly.
const slotKeys = compactRich
 ? viewport === 'desktop' ? ['badge#1144:312','overlayAction#1144:331','author#1144:350','footer#1144:369']
 : state === 'hover' ? ['badge#1144:124','overlayAction#1144:141','author#1144:158','footer#1144:175']
 : state === 'fallback-image' ? ['badge#1144:214','overlayAction#1144:232','author#1144:250','footer#1144:268']
 : ['badge#1144:42','overlayAction#1144:58','author#1144:74','footer#1144:90']
 : viewport === 'mobile' ? ['badge#1122:6','overlayAction#1122:18','author#1122:30','footer#1122:42']
 : ['badge#1122:64','overlayAction#1122:77','author#1122:90','footer#1122:103'];
const badge = rich ? instance.getSlot(slotKeys[0]) : undefined;
const overlayAction = rich ? instance.getSlot(slotKeys[1]) : undefined;
const author = rich ? instance.getSlot(slotKeys[2]) : undefined;
const footer = rich ? instance.getSlot(slotKeys[3]) : undefined;
// content and viewport are native media/responsive previews. Image URLs and swatch colors belong to application data.
// focused/hover/fallback-image are visual previews, not controllable Thumbnail props.
// src/fallbackSrc and a single asChild router Link remain caller-owned data/navigation.
export default {
 id:'thumbnail', imports:['import { Thumbnail } from "@inova-lab-ws/ui"'],
 example:figma.code`<Thumbnail appearance="${appearance}" size="${size}" aspectRatio="${aspectRatio}" ${showCaption ? figma.code`caption="${caption}"` : ''} ${showMetadata ? figma.code`metadata="${metadata}"` : ''} fallback="${fallback}" ${state === 'unavailable' ? 'unavailable' : ''} ${badge ? figma.code`badge={<>${badge}</>}` : ''} ${overlayAction ? figma.code`overlayAction={<>${overlayAction}</>}` : ''} ${author ? figma.code`author={<>${author}</>}` : ''} ${footer ? figma.code`footer={<>${footer}</>}` : ''} />`,
 metadata:{nestable:true}
};

