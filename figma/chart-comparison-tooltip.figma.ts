// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1054-327
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/chart-shared.tsx
// component=ComparisonTooltip
import figma from "figma";
const instance = figma.selectedInstance;
const title=instance.getString('date');
const showComparison=instance.getBoolean('show-comparison');
const showBreakdown=instance.getBoolean('show-breakdown');
const current=instance.getString('current value');
const previous=instance.getString('previous value');
const keys=instance.findConnectedInstances(n=>n.codeConnectId()==='chart-line-key');
const key0=keys[0]?.type==='INSTANCE' ? keys[0].executeTemplate().metadata?.props : undefined;
const key1=keys[1]?.type==='INSTANCE' ? keys[1].executeTemplate().metadata?.props : undefined;
const categories=instance.findLayers(n=>n.type==='TEXT'&&n.name==='category');
const values=instance.findLayers(n=>n.type==='TEXT'&&n.name==='value');
const category0=categories[0]?.type==='TEXT'?categories[0].textContent:'';
const category1=categories[1]?.type==='TEXT'?categories[1].textContent:'';
// Native examples may use en-US or pt-BR display formatting; retain decimal magnitude.
function numeric(text:string){
 let s=text.trim().replace(/[^\d,.\-+]/g,'');
 if(!/\d/.test(s)) return 'null';
 const dot=s.lastIndexOf('.'),comma=s.lastIndexOf(',');
 if(dot>=0&&comma>=0){const decimal=dot>comma?'.':',';const group=decimal==='.'?',':'.';s=s.split(group).join('').replace(decimal,'.');}
 else if(comma>=0) s=/^[+-]?\d{1,3}(,\d{3})+$/.test(s)?s.replaceAll(',',''):s.replace(',','.');
 else if(dot>=0&&/^[+-]?\d{1,3}(\.\d{3})+$/.test(s)) s=s.replaceAll('.','');
 const n=Number(s);return Number.isFinite(n)?String(n):'null';
}
const v0=values[0]?.type==='TEXT'?numeric(values[0].textContent):'null';
const v1=values[1]?.type==='TEXT'?numeric(values[1].textContent):'null';
const comparison=showComparison?figma.code`, {label:"${key1?.label}",value:${numeric(previous)},lineStyle:"${key1?.lineStyle}",colorClass:"text-text-muted"}`:'';
const breakdown=showBreakdown?figma.code`, {label:"${category0}",value:${v0}}, {label:"${category1}",value:${v1}}`:'';
export default {
 id:'chart-comparison-tooltip',imports:['import { ComparisonTooltip } from "@inova-lab-ws/ui"'],
 example:figma.code`<ComparisonTooltip index={0} count={1} title="${title}" rows={[{label:"${key0?.label}",value:${numeric(current)},lineStyle:"${key0?.lineStyle}",colorClass:"text-chart-series1"}${comparison}${breakdown}]} />`,
 metadata:{nestable:true,props:{placementIsExample:true}}
};
