// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1055-252
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/area-chart.tsx
// component=AreaChart
import figma from "figma";
const instance = figma.selectedInstance;
const nativeState=instance.getEnum('state',{data:'data',zero:'zero','null-gap':'null-gap',loading:'loading',empty:'empty',missing:'missing',active:'data','active-null':'null-gap',forecast:'forecast','forecast-active':'forecast','forecast-null':'forecast-null'});
const state=instance.getEnum('state',{data:'ready',zero:'ready','null-gap':'ready',loading:'loading',empty:'empty',missing:'unavailable',active:'ready','active-null':'ready',forecast:'ready','forecast-active':'ready','forecast-null':'ready'});
// Active/active-null are interaction previews: pointer, touch or keyboard governs the runtime active point.
// Viewport is responsive in code. Both Figma options intentionally produce the same API.
const viewport=instance.getEnum('viewport',{desktop:'desktop',mobile:'mobile'});
const comparison=instance.getBoolean('show-comparison');
const showExtrema=instance.getBoolean('show-extrema');
const projectedLabel=instance.getString('projectedLabel');
const rangeLabel=instance.getString('rangeLabel');
const forecast=nativeState==='forecast'||nativeState==='forecast-null';
const actualLegend=forecast?instance.findText('legend label',{path:['forecast legend','Actual']}):undefined;
const previousLegend=forecast?instance.findText('legend label',{path:['forecast legend','Previous period']}):undefined;
const legendProps=actualLegend?.type==='TEXT'?figma.code`seriesLabel="${actualLegend.textContent}" ${previousLegend?.type==='TEXT'?figma.code`previousSeriesLabel="${previousLegend.textContent}"`:''}`:'';
// Figma's paths are illustrative, not a data API. These small synthetic examples preserve zero/null semantics.
// Synthetic prior measurements keep the independent comparison toggle meaningful, including a missing forecast.
const sample=nativeState==='forecast'||nativeState==='forecast-null' ? nativeState==='forecast-null' ? '[{label:"ago/26",value:80,previousValue:70},{label:"set/26",value:100,previousValue:90},{label:"out/26",value:120,previousValue:100},{label:"nov/26",value:null,previousValue:110,projected:true,low:null,high:null},{label:"dez/26",value:160,previousValue:130,projected:true,low:140,high:180}]' : '[{label:"ago/26",value:80,previousValue:70},{label:"set/26",value:100,previousValue:90},{label:"out/26",value:120,previousValue:100},{label:"nov/26",value:140,previousValue:110,projected:true,low:120,high:160},{label:"dez/26",value:160,previousValue:130,projected:true,low:140,high:180},{label:"jan/27",value:180,previousValue:150,projected:true,low:150,high:210}]' : nativeState==='zero' ? '[{label:"01 Oct",value:0,previousValue:12},{label:"08 Oct",value:0,previousValue:8}]' : nativeState==='null-gap' ? '[{label:"01 Oct",value:0,previousValue:12},{label:"08 Oct",value:null,previousValue:8},{label:"15 Oct",value:100,previousValue:90}]' : nativeState==='empty' ? '[]' : nativeState==='missing' ? '[{label:"01 Oct",value:null}]' : '[{label:"01 Oct",value:0,previousValue:12},{label:"08 Oct",value:80,previousValue:45},{label:"15 Oct",value:150,previousValue:140}]';
export default {
 id:'area-chart',imports:['import { AreaChart } from "@inova-lab-ws/ui"'],
 example:figma.code`<AreaChart label="Performance" data={${sample}} state="${state}" projectedLabel="${projectedLabel}" rangeLabel="${rangeLabel}" ${legendProps} ${comparison?'comparison':''} ${showExtrema?'showExtrema':''} />`,
 metadata:{nestable:true,props:{viewport,nativeState,dataIsSynthetic:true}}
};
