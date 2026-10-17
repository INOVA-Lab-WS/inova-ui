// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=278-581
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/pill-tab.tsx
// component=PillTab
import figma from 'figma';
const instance=figma.selectedInstance;
const label=instance.getString('label');
const selected=instance.getEnum('state',{default:false,hover:false,selected:true});
// Native focused is a preview flag. Browser keyboard focus governs the runtime outline.
const focused=instance.getBoolean('focused');
export default {
 id:'pill-tab',imports:['import { PillTab } from "@inova-lab-ws/ui"'],
 example:figma.code`<PillTab ${selected?'selected':''}>${label}</PillTab>`,
 metadata:{nestable:true,props:{label,selected,focused}}
};
