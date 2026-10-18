// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1144-1370
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/thumbnail-rail.tsx
// component=ThumbnailRail
import figma from 'figma';
const instance = figma.selectedInstance;
const content = instance.getSlot('content');
// viewport previews responsive compact-card widths; ThumbnailRail supplies scrolling and snapping.
export default {
 id:'thumbnail-rail', imports:['import { ThumbnailRail } from "@inova-lab-ws/ui"'],
 example:figma.code`<ThumbnailRail>${content ?? ''}</ThumbnailRail>`,
 metadata:{nestable:true}
};
