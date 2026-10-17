// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1057-3153
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/bar-chart.tsx
// component=BarChart / HorizontalBarChart
import figma from "figma";
const instance = figma.selectedInstance;
const orientation=instance.getEnum('orientation',{horizontal:'horizontal',vertical:'vertical'});
const state=instance.getEnum('state',{idle:'idle',selected:'selected',focus:'focus'});
const chart=instance.findInstance('native chart');
// Native child content stays dynamic. Existing bar-chart templates provide its data/recipe.
const child=chart.type==='INSTANCE'?chart.executeTemplate().example:undefined;
export default {
 id:'selectable-chart',imports:['import { cloneElement, useState } from "react"', 'import { BarChart, HorizontalBarChart } from "@inova-lab-ws/ui"'],
 example:figma.code`function SelectableChartExample() {
  const chartElement = ${child};
  const [selectedLabel, setSelectedLabel] = useState<string | null>(${state === 'selected' ? 'chartElement.props.data[0]?.label ?? null' : 'null'});
  return cloneElement(chartElement, { selectedLabel, onSelectionChange: setSelectedLabel });
}`,
 metadata:{nestable:true,props:{orientation,state,selectionRequiresControlledLabel:true}}
};
