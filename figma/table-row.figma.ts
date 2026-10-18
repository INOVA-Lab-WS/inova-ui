// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=621-3646
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/table-row.tsx
// component=TableRow
import figma from 'figma';
const instance=figma.selectedInstance;
const type=instance.getEnum('type',{header:'header',body:'body'});
const interaction=instance.getEnum('interaction',{static:'static',idle:'idle',hover:'hover',focus:'focus'});
const interactive=type==='body'&&interaction!=='static';
const divider=instance.getBoolean('show-divider');
const cells=instance.getSlot('cells');
// Hover/focus previews map to the interactive contract; the browser supplies its actual state.
export default {
 id:'table-row',imports:['import { TableRow } from "@inova-lab-ws/ui"'],
 example:figma.code`<TableRow type="${type}" ${interactive?'interactive':''} ${divider?'':'className="border-b-0"'}>${cells}</TableRow>`,
 metadata:{nestable:true,props:{type,interaction}}
};
