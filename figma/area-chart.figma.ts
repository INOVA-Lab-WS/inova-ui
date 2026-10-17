// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1055-252
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/area-chart.tsx
// component=AreaChart
import figma from "figma";
const instance = figma.selectedInstance;
const nativeState=instance.getEnum('state',{data:'data',zero:'zero','null-gap':'null-gap',loading:'loading',empty:'empty',missing:'missing'});
const state=instance.getEnum('state',{data:'ready',zero:'ready','null-gap':'ready',loading:'loading',empty:'empty',missing:'unavailable'});
// Viewport is responsive in code. Both Figma options intentionally produce the same API.
const viewport=instance.getEnum('viewport',{desktop:'desktop',mobile:'mobile'});
const comparison=instance.getBoolean('show-comparison');
const showExtrema=instance.getBoolean('show-extrema');
// Figma's paths are illustrative, not a data API. These small synthetic examples preserve zero/null semantics.
const sample=nativeState==='zero' ? '[{label:"01 Oct",value:0,previousValue:12},{label:"08 Oct",value:0,previousValue:8}]' : nativeState==='null-gap' ? '[{label:"01 Oct",value:0,previousValue:12},{label:"08 Oct",value:null,previousValue:8},{label:"15 Oct",value:100,previousValue:90}]' : nativeState==='empty' ? '[]' : nativeState==='missing' ? '[{label:"01 Oct",value:null}]' : '[{label:"01 Oct",value:0,previousValue:12},{label:"08 Oct",value:80,previousValue:45},{label:"15 Oct",value:150,previousValue:140}]';
export default {
 id:'area-chart',imports:['import { AreaChart } from "@inova-lab-ws/ui"'],
 example:figma.code`<AreaChart label="Performance" data={${sample}} state="${state}" ${comparison?'comparison':''} ${showExtrema?'showExtrema':''} />`,
 metadata:{nestable:true,props:{viewport,nativeState,dataIsSynthetic:true}}
};
