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
const appearance = instance.getEnum('appearance', {default:'default',frameless:'frameless'});
const size = instance.getEnum('size', {default:'default',compact:'compact'});
const aspectRatio = instance.getEnum('aspect-ratio', {'1:1':'1:1','4:3':'4:3'});
const rich = composition === 'rich';
// Friendly names resolve the selected specimen's actual SLOT; suffixed definition keys return empty sections.
const badge = rich ? instance.getSlot('badge') : undefined;
const overlayAction = rich ? instance.getSlot('overlayAction') : undefined;
const author = rich ? instance.getSlot('author') : undefined;
const footer = rich ? instance.getSlot('footer') : undefined;
// content and viewport are native media/responsive previews. Image URLs and swatch colors belong to application data.
// focused/hover/fallback-image are visual previews, not controllable Thumbnail props.
// src/fallbackSrc and a single asChild router Link remain caller-owned data/navigation.
export default {
 id:'thumbnail', imports:['import { Thumbnail } from "@inova-lab-ws/ui"'],
 example:figma.code`<Thumbnail appearance="${appearance}" size="${size}" aspectRatio="${aspectRatio}" ${showCaption ? figma.code`caption="${caption}"` : ''} ${showMetadata ? figma.code`metadata="${metadata}"` : ''} fallback="${fallback}" ${state === 'unavailable' ? 'unavailable' : ''} ${badge ? figma.code`badge={<>${badge}</>}` : ''} ${overlayAction ? figma.code`overlayAction={<>${overlayAction}</>}` : ''} ${author ? figma.code`author={<>${author}</>}` : ''} ${footer ? figma.code`footer={<>${footer}</>}` : ''} />`,
 metadata:{nestable:true}
};

