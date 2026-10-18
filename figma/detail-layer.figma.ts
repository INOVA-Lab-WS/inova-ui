// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1145-422
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/detail-layer.tsx
// component=DetailLayer
import figma from 'figma';
const instance = figma.selectedInstance;
const title = instance.getString('title');
const media = instance.getSlot('media');
const content = instance.getSlot('content');
// viewport previews CSS layout: desktop side panel, mobile content beneath media.
// Replace onOpenChange with controlled application state. Native open specimen does not simulate navigation/focus.
// image URLs, zoom callbacks, focus refs, panelWidth and labels remain caller-owned inputs.
export default {
 id:'detail-layer', imports:['import { DetailLayer } from "@inova-lab-ws/ui"'],
 example:figma.code`<DetailLayer open onOpenChange={() => {}} title="${title}" ${media ? figma.code`media={<>${media}</>}` : ''}>${content ?? ''}</DetailLayer>`,
 metadata:{nestable:true}
};
