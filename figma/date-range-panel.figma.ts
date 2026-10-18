// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1123-2595
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/date-range-picker.tsx
// component=DateRangePanel
import figma from "figma";
const instance=figma.selectedInstance;
const state=instance.getEnum('state',{default:'default'});
// Month and partial-range summary are interaction previews. The caller owns the committed DateRange; presets use the runtime's date policy.
export default {id:'date-range-panel',imports:['import { DateRangePanel } from "@inova-lab-ws/ui"'],example:figma.code`<DateRangePanel value={null} onValueChange={(range) => { /* Commit range in the application. */ }} onApply={() => { /* Return to results or the filter list. */ }} />`,metadata:{nestable:true,props:{state}}};
