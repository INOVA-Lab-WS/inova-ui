// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=956-4259
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/pill-tab.tsx
// component=PillTabs
import figma from 'figma';
const instance=figma.selectedInstance;
const fullWidth=instance.getEnum('width',{hug:false,full:true});
const tabs=instance.findConnectedInstances(n=>n.codeConnectId()==='pill-tab');
const tab0=tabs[0]?.type==='INSTANCE'?tabs[0].executeTemplate().example:undefined;
const tab1=tabs[1]?.type==='INSTANCE'?tabs[1].executeTemplate().example:undefined;
const tab2=tabs[2]?.type==='INSTANCE'?tabs[2].executeTemplate().example:undefined;
// Navigation/asChild remain runtime choices; this native visual group defines no navigation property.
export default {
 id:'pill-tabs',imports:['import { PillTabs } from "@inova-lab-ws/ui"'],
 example:figma.code`<PillTabs aria-label="Abas" ${fullWidth?'fullWidth':''}>${tab0}${tab1}${tab2}</PillTabs>`,
 metadata:{nestable:true}
};
