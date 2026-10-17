// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1054-322
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/chart-shared.tsx
// component=ChartLineKey
import figma from "figma";
const instance = figma.selectedInstance;
const series = instance.getEnum('series', {current:'current',previous:'previous'});
const label = series === 'previous' ? instance.getString('previous-label') : instance.getString('label');
const lineStyle = series === 'previous' ? 'dashed' : 'solid';
export default {
 id:'chart-line-key', imports:['import { ChartLineKey } from "@inova-lab-ws/ui"'],
 example:figma.code`<ChartLineKey label="${label}" lineStyle="${lineStyle}" />`,
 metadata:{nestable:true,props:{label,lineStyle}}
};
