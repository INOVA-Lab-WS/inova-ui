// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1123-3983
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/filter-bar.tsx
// component=FilterBar
import figma from "figma";
const instance=figma.selectedInstance;
const view=instance.getEnum('view',{desktop:'desktop','mobile-closed':'mobile-closed','mobile-list':'mobile-list','mobile-panel':'mobile-panel'});
const title=instance.getString('title');
const primary=instance.getSlot('primary');
const l0=instance.getString('filter-0-label'),s0=instance.getString('filter-0-summary'),a0=instance.getBoolean('filter-0-active');
const l1=instance.getString('filter-1-label'),s1=instance.getString('filter-1-summary'),a1=instance.getBoolean('filter-1-active');
const l2=instance.getString('filter-2-label'),s2=instance.getString('filter-2-summary'),a2=instance.getBoolean('filter-2-active');
const f0=instance.getSlot('filter-0-field')??'',p0=instance.getSlot('filter-0-panel')??'';
const f1=instance.getSlot('filter-1-field')??'',p1=instance.getSlot('filter-1-panel')??'';
const f2=instance.getSlot('filter-2-field')??'',p2=instance.getSlot('filter-2-panel')??'';
// Active count derives from the 3 active flags in code. View/open/back are internal responsive navigation, not public props.
// Each field/panel remains dynamic native slot content; the application supplies a shared selection binding.
export default {id:'filter-bar',imports:['import { FilterBar } from "@inova-lab-ws/ui"'],example:figma.code`<FilterBar title="${title}" primary={<>${primary??''}</>} filters={[
 {id:"filter-0",label:"${l0}",summary:"${s0}",active:${a0},field:<>${f0}</>,panel:<>${p0}</>},
 {id:"filter-1",label:"${l1}",summary:"${s1}",active:${a1},field:<>${f1}</>,panel:<>${p1}</>},
 {id:"filter-2",label:"${l2}",summary:"${s2}",active:${a2},field:<>${f2}</>,panel:<>${p2}</>}
]} />`,metadata:{nestable:true,props:{view}}};
