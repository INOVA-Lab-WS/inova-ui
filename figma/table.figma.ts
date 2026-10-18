// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=621-3694
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/table.tsx
// component=Table
import figma from 'figma';
const instance=figma.selectedInstance;
const state=instance.getEnum('state',{populated:'populated',empty:'empty',loading:'loading'});
const frameless=instance.getEnum('frameless',{'false':false,'true':true});
const rowInset=instance.getEnum('row-inset',{'false':false,'true':true});
const title=instance.getString('title');
const summary=instance.getString('summary');
const note=instance.getString('note');
const showSummary=instance.getBoolean('show-summary');
const showFooter=instance.getBoolean('show-footer');
const content=instance.getSlot('content');
let head;let body=figma.code``;let foundRow=false;
// Preserve semantic header/body grouping when the slot contains native TableRow components.
for(const row of content?.connectedInstances ?? []) {
 if(row.type==='INSTANCE'&&row.codeConnectId()==='table-row') {
  const result=row.executeTemplate();foundRow=true;
  if(result.metadata?.props?.type==='header') head=result.example;
  else body=figma.code`${body}${result.example}`;
 }
}
const rows=state==='populated'?(foundRow?body:(content??'')):'';
export default {
 id:'table',imports:['import { Table } from "@inova-lab-ws/ui"'],
 example:figma.code`<Table title="${title}" ${showSummary?figma.code`summary="${summary}"`:''} ${showFooter?figma.code`note="${note}"`:''} ${frameless?'frameless':''} ${rowInset?'rowInset':''} ${state==='empty'?'empty':''} ${state==='loading'?'busy skeletonRow="text" skeletonColumns={4}':''} ${head?figma.code`head={${head}}`:''}>${rows}</Table>`,
 metadata:{nestable:true}
};
