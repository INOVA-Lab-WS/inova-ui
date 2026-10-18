// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1122-6998
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/breadcrumb.tsx
// component=Breadcrumb
import figma from 'figma';
const instance = figma.selectedInstance;
const first = instance.getString('item-0-label');
const second = instance.getString('item-1-label');
const current = instance.getString('item-2-label');
// Native defines labels, not routes. Add href to ancestor items from application navigation.
// state=default is a static native preview, not a Breadcrumb prop.
export default {
 id:'breadcrumb', imports:['import { Breadcrumb } from "@inova-lab-ws/ui"'],
 example:figma.code`<Breadcrumb items={[{ label: "${first}" }, { label: "${second}" }, { label: "${current}" }]} />`,
 metadata:{nestable:true}
};
