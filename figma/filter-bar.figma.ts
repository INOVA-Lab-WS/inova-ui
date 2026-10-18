// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1123-3983
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/filter-bar.tsx
// component=FilterBar
import figma from "figma";
const instance=figma.selectedInstance;
const view=instance.getEnum('view',{desktop:'desktop','mobile-closed':'mobile-closed','mobile-list':'mobile-list','mobile-panel':'mobile-panel'});
const title=instance.getString('title');
const primary=instance.getSlot('primary');
const showClearAll=instance.getBoolean('showClearAll');
const clearButton=instance.findInstance('clear all / native outline Button');
const clearLabel=clearButton.type==='INSTANCE'?clearButton.getString('label'):undefined;
const resultsButton=instance.findInstance('Show results');
const resultsLabel=resultsButton.type==='INSTANCE'?resultsButton.getString('label'):undefined;
const l0=instance.getString('filter-0-label'),s0=instance.getString('filter-0-summary'),a0=instance.getBoolean('filter-0-active');
const l1=instance.getString('filter-1-label'),s1=instance.getString('filter-1-summary'),a1=instance.getBoolean('filter-1-active');
const l2=instance.getString('filter-2-label'),s2=instance.getString('filter-2-summary'),a2=instance.getBoolean('filter-2-active');
const f0=instance.getSlot('filter-0-field')??'',p0=instance.getSlot(view==='mobile-panel'?'filter-0-panel-mobile':'filter-0-panel')??'';
const f1=instance.getSlot('filter-1-field')??'',p1=instance.getSlot('filter-1-panel')??'';
const f2=instance.getSlot('filter-2-field')??'',p2=instance.getSlot('filter-2-panel')??'';
// Active count derives from the 3 active flags in code. View/open/back are internal responsive navigation, not public props.
// Each field/panel remains dynamic native slot content; the application supplies a shared selection binding.
// The library owns the outline clear Button and 56px icon trigger. The caller resets its shared filter values.
export default {id:'filter-bar',imports:['import { FilterBar } from "@inova-lab-ws/ui"'],example:figma.code`<FilterBar title="${title}" ${resultsLabel?figma.code`resultsLabel="${resultsLabel}"`:''} ${showClearAll?figma.code`showClearAll onClearAll={() => { /* Reset caller-owned filter values. */ }} ${clearLabel?figma.code`clearAllLabel="${clearLabel}"`:''}`:'showClearAll={false}'} primary={<>${primary??''}</>} filters={[
 {id:"filter-0",label:"${l0}",summary:"${s0}",active:${a0},field:<>${f0}</>,panel:<>${p0}</>},
 {id:"filter-1",label:"${l1}",summary:"${s1}",active:${a1},field:<>${f1}</>,panel:<>${p1}</>},
 {id:"filter-2",label:"${l2}",summary:"${s2}",active:${a2},field:<>${f2}</>,panel:<>${p2}</>}
]} />`,metadata:{nestable:true,props:{view}}};
