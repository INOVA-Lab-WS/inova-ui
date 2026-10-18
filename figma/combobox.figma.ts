// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1123-3707
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/combobox.tsx
// component=Combobox
import figma from "figma";
const instance=figma.selectedInstance;
const viewport=instance.getEnum('viewport',{desktop:'desktop',mobile:'mobile'});
const state=instance.getEnum('state',{closed:'closed',open:'open'});
const placeholder=instance.getString('placeholder');
const panel=instance.findConnectedInstance('combobox-panel');
const config=panel?.type==='INSTANCE'?panel.executeTemplate().metadata?.props:undefined;
// A closed field may not expose its example panel data; supply application options rather than invent names.
const options=config?.options??figma.code`[]`;
export default {id:'combobox',imports:['import { Combobox } from "@inova-lab-ws/ui"'],example:figma.code`<Combobox presentation="responsive" placeholder="${placeholder}" options={${options}} ${config?.searchPlaceholder?figma.code`searchPlaceholder="${config.searchPlaceholder}"`:''} ${config?.emptyText?figma.code`emptyText="${config.emptyText}"`:''} ${config?.allowCreate?figma.code`allowCreate onCreate={(query) => query}`:''} />`,metadata:{nestable:true,props:{viewport,state}}};
