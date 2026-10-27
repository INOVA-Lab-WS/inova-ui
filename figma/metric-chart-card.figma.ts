// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1055-398
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/metric-chart-card.tsx
// component=MetricChartCard
import figma from "figma";
const instance = figma.selectedInstance;
const count=instance.getEnum('metrics',{'2':2,'3':3,'4':4,'5':5,'6':6});
// Layout responds to the viewport; no invented viewport code prop.
const viewport=instance.getEnum('viewport',{desktop:'desktop',mobile:'mobile'});
const bodyPadding=instance.getEnum('body-padding',{default:'default',none:'none'});
const title=instance.getString('title');
const showHeader=instance.getBoolean('show-header');
// Resolve the actual bound legacy child; the swap definition alone has no instance context on the server.
const chartChild=instance.findConnectedInstance('area-chart');
const chart=chartChild?.type==='INSTANCE'?chartChild:instance.getInstanceSwap('chart');
const chartCode=chart?.type==='INSTANCE' ? chart.executeTemplate().example : undefined;
const bodySlot=instance.getSlot('body');
// Only the 2-metric composition owns body SLOT content; 3–6 metrics retain the chart instance.
const bodyCode=count===2&&bodySlot?.length?bodySlot:chartCode??'';
const metrics=instance.findConnectedInstances(n=>n.codeConnectId()==='metric-tile');
const m0=metrics[0]?.type==='INSTANCE' ? metrics[0].executeTemplate().metadata?.props?.fields : undefined;
const m1=metrics[1]?.type==='INSTANCE' ? metrics[1].executeTemplate().metadata?.props?.fields : undefined;
const m2=metrics[2]?.type==='INSTANCE' ? metrics[2].executeTemplate().metadata?.props?.fields : undefined;
const m3=metrics[3]?.type==='INSTANCE' ? metrics[3].executeTemplate().metadata?.props?.fields : undefined;
const m4=metrics[4]?.type==='INSTANCE' ? metrics[4].executeTemplate().metadata?.props?.fields : undefined;
const m5=metrics[5]?.type==='INSTANCE' ? metrics[5].executeTemplate().metadata?.props?.fields : undefined;
const metricData=count===2 ? figma.code`[{id:"metric-1",${m0}},{id:"metric-2",${m1}}]` : count===3 ? figma.code`[{id:"metric-1",${m0}},{id:"metric-2",${m1}},{id:"metric-3",${m2}}]` : count===5 ? figma.code`[{id:"metric-1",${m0}},{id:"metric-2",${m1}},{id:"metric-3",${m2}},{id:"metric-4",${m3}},{id:"metric-5",${m4}}]` : count===6 ? figma.code`[{id:"metric-1",${m0}},{id:"metric-2",${m1}},{id:"metric-3",${m2}},{id:"metric-4",${m3}},{id:"metric-5",${m4}},{id:"metric-6",${m5}}]` : figma.code`[{id:"metric-1",${m0}},{id:"metric-2",${m1}},{id:"metric-3",${m2}},{id:"metric-4",${m3}}]`;
export default {
 id:'metric-chart-card',imports:['import { MetricChartCard } from "@inova-lab-ws/ui"'],
 example:figma.code`<MetricChartCard bodyPadding="${bodyPadding}" ${showHeader ? figma.code`title="${title}"` : ''} metrics={${metricData}}>${bodyCode}</MetricChartCard>`,
 metadata:{nestable:true,props:{viewport}}
};
