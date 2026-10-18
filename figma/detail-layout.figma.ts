// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1122-1740
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/detail-layout.tsx
// component=DetailLayout
import figma from 'figma';
const instance = figma.selectedInstance;
const content = instance.getSlot('content');
const sidebar = instance.getSlot('sidebar');
// viewport previews CSS layout: inline content below on mobile, sticky alongside on desktop.
// stickyTop and sidebarLabel stay application choices; native defines neither property.
export default {
 id:'detail-layout', imports:['import { DetailLayout } from "@inova-lab-ws/ui"'],
 example:figma.code`<DetailLayout sidebar={<>${sidebar}</>}>${content}</DetailLayout>`,
 metadata:{nestable:true}
};
