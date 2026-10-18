// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1122-7014
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/breadcrumb.tsx
// component=BreadcrumbBack
import figma from 'figma';
const instance = figma.selectedInstance;
const back = instance.findInstance('compact back Button');
const label = back.type === 'INSTANCE' ? back.getString('label') : '';
const content = instance.getSlot('content');
// Native's compact back Button is owned internally by BreadcrumbBack; only its editable label is input.
// Supply href or replace onBack with the application's inline-panel navigation.
// state=default has no runtime prop.
export default {
 id:'breadcrumb-back', imports:['import { BreadcrumbBack } from "@inova-lab-ws/ui"'],
 example:figma.code`<BreadcrumbBack label="${label}" onBack={() => {}}>${content}</BreadcrumbBack>`,
 metadata:{nestable:true}
};
