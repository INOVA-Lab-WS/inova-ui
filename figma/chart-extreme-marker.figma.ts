// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1055-253
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/chart-shared.tsx
// component=ChartExtremeMarker
import figma from "figma";
const instance = figma.selectedInstance;
const label=instance.getString('label');
export default {id:'chart-extreme-marker',imports:['import { ChartExtremeMarker } from "@inova-lab-ws/ui"'],example:figma.code`<ChartExtremeMarker label="${label}" />`,metadata:{nestable:true,props:{label}}};
