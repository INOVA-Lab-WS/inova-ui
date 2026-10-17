// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=278-1167
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/multi-select.tsx
// component=MultiSelect
import figma from 'figma';
const instance=figma.selectedInstance;
const viewport=instance.getEnum('viewport',{desktop:'desktop',mobile:'mobile'});
const state=instance.getEnum('state',{'closed-empty':'closed-empty','closed-single':'closed-single','closed-multiple':'closed-multiple',open:'open','option-selected':'option-selected','option-unselected':'option-unselected','option-hover':'option-hover','all-selected':'all-selected','search-results':'search-results','search-none':'search-none'});
const allLabel=instance.getString('option-0-label');
const label1=instance.getString('option-1-label');
const label2=instance.getString('option-2-label');
const label3=instance.getString('option-3-label');
const accessibleName=instance.getString('accessible-name');
const noResults=instance.getString('no-results');
const placeholder=instance.getString('trigger-label-·-closed-empty/open/option-unselected/option-hover/search-none');
const allSelectedLabel=instance.getString('trigger-label-·-all-selected');
const searching=state==='search-results'||state==='search-none';
const searchable=searching?instance.getBoolean('searchable-·-search-results/search-none'):instance.getBoolean('searchable-·-closed-empty/closed-single/closed-multiple/open/option-selected/option-unselected/option-hover/all-selected');
const icon1=instance.getBoolean('option-1-show-icon')?instance.getInstanceSwap('option-1-icon'):undefined;
const icon2=instance.getBoolean('option-2-show-icon')?instance.getInstanceSwap('option-2-icon'):undefined;
const icon3=instance.getBoolean('option-3-show-icon')?instance.getInstanceSwap('option-3-icon'):undefined;
const code1=icon1?.type==='INSTANCE'?icon1.executeTemplate().example:undefined;
const code2=icon2?.type==='INSTANCE'?icon2.executeTemplate().example:undefined;
const code3=icon3?.type==='INSTANCE'?icon3.executeTemplate().example:undefined;
const single=state==='closed-single'||state==='option-selected'||state==='search-results';
const selected=state==='all-selected'?'["option-1","option-2","option-3"]':state==='closed-multiple'?'["option-1","option-2"]':single?'["option-1"]':'[]';
// Open, hover, query and clear/all-row visibility are native preview states, not runtime props.
// The runtime owns popover/query/clear behavior; option icon1 automatically appears in a single-selection trigger.
// Custom single/multiple trigger display strings have no counterpart in the runtime's option-derived labels/count.
export default {
 id:'multi-select',imports:['import { MultiSelect } from "@inova-lab-ws/ui"'],
 example:figma.code`<MultiSelect label={<span className="sr-only">${accessibleName}</span>} allLabel="${allLabel}" placeholder="${placeholder}" allSelectedLabel="${allSelectedLabel}" noResults="${noResults}" ${searchable?'searchable':''} defaultValue={${selected}} options={[
 {value:"option-1",label:"${label1}"${code1?figma.code`,icon:(${code1})`:''}},
 {value:"option-2",label:"${label2}"${code2?figma.code`,icon:(${code2})`:''}},
 {value:"option-3",label:"${label3}"${code3?figma.code`,icon:(${code3})`:''}}
]} />`,
 metadata:{nestable:true,props:{viewport,state}}
};
