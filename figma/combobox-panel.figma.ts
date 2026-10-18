// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1123-3546
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/combobox.tsx
// component=ComboboxPanel
import figma from "figma";
const instance=figma.selectedInstance;
const state=instance.getEnum('state',{results:'results',empty:'empty',create:'create',error:'error',creating:'creating'});
const label0=instance.getString('option-0-label');
const label1=instance.getString('option-1-label');
const label2=instance.getString('option-2-label');
const avatar=instance.getBoolean('option-0-show-avatar')?instance.findInstance('option avatar'):undefined;
const avatarCode=avatar?.type==='INSTANCE'?avatar.executeTemplate().example:undefined;
const i1=instance.getBoolean('option-1-show-icon')?instance.getInstanceSwap('option-1-icon'):undefined;
const i2=instance.getBoolean('option-2-show-icon')?instance.getInstanceSwap('option-2-icon'):undefined;
const c1=i1?.type==='INSTANCE'?i1.executeTemplate().example:undefined;
const c2=i2?.type==='INSTANCE'?i2.executeTemplate().example:undefined;
const options=figma.code`[{value:"option-0",label:"${label0}"${avatarCode?figma.code`,avatar:(${avatarCode})`:''}},{value:"option-1",label:"${label1}"${c1?figma.code`,icon:(${c1})`:''}},{value:"option-2",label:"${label2}"${c2?figma.code`,icon:(${c2})`:''}}]`;
const effectiveOptions=state==='empty'?figma.code`[]`:options;
const searchPlaceholder=instance.getString('searchPlaceholder');
const emptyText=instance.getString('emptyText');
const createLabel=instance.getString('createLabel');
const createErrorText=instance.getString('createErrorText');
const allowCreate=state==='create'||state==='error'||state==='creating';
const cancel=instance.findInstance('Cancel');
const reset=instance.findInstance('Reset original');
const cancelLabel=cancel.type==='INSTANCE'?cancel.getString('label'):undefined;
const resetLabel=reset.type==='INSTANCE'?reset.getString('label'):undefined;
// Search/create/error/creating are user-driven previews; no forced state/query prop exists.
// The runtime disables options and displays Criando… while the caller's creation promise is pending.
export default {id:'combobox-panel',imports:['import { ComboboxPanel } from "@inova-lab-ws/ui"'],example:figma.code`<ComboboxPanel options={${effectiveOptions}} value={null} onValueChange={(value) => { /* Commit chosen value. */ }} originalValue="option-0" searchPlaceholder="${searchPlaceholder}" emptyText="${emptyText}" createLabel="${createLabel}" createErrorText="${createErrorText}" ${cancelLabel?figma.code`cancelLabel="${cancelLabel}"`:''} ${resetLabel?figma.code`resetLabel="${resetLabel}"`:''} ${allowCreate?figma.code`allowCreate onCreate={(query) => query}`:''} />`,metadata:{nestable:true,props:{options:effectiveOptions,searchPlaceholder,emptyText,createLabel,createErrorText,allowCreate}}};
