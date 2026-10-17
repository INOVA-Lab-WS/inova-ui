// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1054-245
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/trend-badge.tsx
// component=TrendBadge
import figma from "figma";
const instance = figma.selectedInstance;
const direction = instance.getEnum('direction', {up:'up',down:'down',equal:'equal'});
const evaluation = instance.getEnum('evaluation', {neutral:'neutral',favorable:'favorable',unfavorable:'unfavorable'});
const value = instance.getString('value');
export default {
 id:'metric-trend', imports:['import { TrendBadge } from "@inova-lab-ws/ui"'],
 example:figma.code`<TrendBadge direction="${direction}" evaluation="${evaluation}" value="${value}" />`,
 metadata:{nestable:true,props:{direction,evaluation,value,trend:figma.code`{ direction: "${direction}", evaluation: "${evaluation}", value: "${value}" }`}}
};
