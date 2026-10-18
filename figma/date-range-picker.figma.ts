// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=278-3087
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/date-range-picker.tsx
// component=DateRangePicker
import figma from "figma";
const instance=figma.selectedInstance;
const presentation=instance.getEnum('presentation',{popover:'popover',sheet:'sheet',responsive:'responsive'});
const viewport=instance.getEnum('viewport',{mobile:'mobile',desktop:'desktop'});
const state=instance.getEnum('state',{'closed-preset':'closed-preset','closed-custom':'closed-custom','open-no-start':'open-no-start','open-start-only':'open-start-only','open-range':'open-range'});
const label=instance.getString('accessible-name');
// Month, range strings and open previews describe the native example. Calendar data and committed range are caller-owned.
export default {id:'date-range-picker',imports:['import { DateRangePicker } from "@inova-lab-ws/ui"'],example:figma.code`<DateRangePicker label={<span className="sr-only">${label}</span>} presentation="${presentation}" value={null} onValueChange={(range) => { /* Commit range in the application. */ }} />`,metadata:{nestable:true,props:{viewport,state}}};
