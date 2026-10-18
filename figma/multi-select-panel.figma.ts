// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1123-2403
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/multi-select.tsx
// component=MultiSelectPanel
import figma from "figma";
const instance=figma.selectedInstance;
const state=instance.getEnum('state',{default:'default'});
const allLabel=instance.getString('option-0-label');
const label1=instance.getString('option-1-label');
const label2=instance.getString('option-2-label');
const label3=instance.getString('option-3-label');
const searchable=instance.getBoolean('searchable-·-closed-empty/closed-single/closed-multiple/open/option-selected/option-unselected/option-hover/all-selected');
const i1=instance.getBoolean('option-1-show-icon')?instance.getInstanceSwap('option-1-icon'):undefined;
const i2=instance.getBoolean('option-2-show-icon')?instance.getInstanceSwap('option-2-icon'):undefined;
const i3=instance.getBoolean('option-3-show-icon')?instance.getInstanceSwap('option-3-icon'):undefined;
const c1=i1?.type==='INSTANCE'?i1.executeTemplate().example:undefined;
const c2=i2?.type==='INSTANCE'?i2.executeTemplate().example:undefined;
const c3=i3?.type==='INSTANCE'?i3.executeTemplate().example:undefined;
const options=figma.code`[{value:"option-1",label:"${label1}"${c1?figma.code`,icon:(${c1})`:''}},{value:"option-2",label:"${label2}"${c2?figma.code`,icon:(${c2})`:''}},{value:"option-3",label:"${label3}"${c3?figma.code`,icon:(${c3})`:''}}]`;
// Panel is controlled and portal-free. Replace this demonstration callback with the application's selection binding.
// Query/open/clear/all-row preview flags are internal runtime behavior, not invented public props.
export default {id:'multi-select-panel',imports:['import { MultiSelectPanel } from "@inova-lab-ws/ui"'],example:figma.code`<MultiSelectPanel allLabel="${allLabel}" searchable={${searchable}} options={${options}} value={[]} onValueChange={(values) => { /* Commit values in the application. */ }} />`,metadata:{nestable:true,props:{options,state}}};
