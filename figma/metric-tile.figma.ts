// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=378-132
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/metric-tile.tsx
// component=MetricTile
import figma from "figma";
const instance = figma.selectedInstance;
const layout = instance.getEnum('layout', {stat:'stat',variant:'variant',count:'count',embedded:'embedded'});
const state = instance.getEnum('state', {default:'default',idle:'idle',selected:'selected',focus:'focus',static:'static',loading:'loading',missing:'missing'});
const context = layout === 'embedded' ? 'embedded' : 'standalone';
const codeLayout = layout === 'embedded' ? 'stat' : layout;
// All legacy per-layout property keys remain mapped; the same slots serve each context.
const label = layout === 'stat' ? instance.getString('label-[layout=stat]') : layout === 'variant' ? instance.getString('label-[layout=variant]') : layout === 'count' ? instance.getString('label-[layout=count]') : instance.getString('label-[layout=embedded]');
const value = layout === 'stat' ? instance.getString('value-[layout=stat]') : layout === 'variant' ? instance.getString('value-[layout=variant]') : layout === 'count' ? instance.getString('value-[layout=count]') : instance.getString('value-[layout=embedded]');
const hint = layout === 'stat' ? instance.getString('hint-[layout=stat]') : layout === 'variant' ? instance.getString('hint-[layout=variant]') : layout === 'count' ? instance.getString('hint-[layout=count]') : instance.getString('hint-[layout=embedded]');
const showHint = layout === 'stat' ? instance.getBoolean('show-hint-[layout=stat]') : layout === 'variant' ? instance.getBoolean('show-hint-[layout=variant]') : layout === 'count' ? instance.getBoolean('show-hint-[layout=count]') : instance.getBoolean('show-hint-[layout=embedded]');
const showHelp = layout === 'stat' ? instance.getBoolean('show-info-[layout=stat]') : layout === 'variant' ? instance.getBoolean('show-info-[layout=variant]') : layout === 'count' ? instance.getBoolean('show-info-[layout=count]') : instance.getBoolean('show-info-[layout=embedded]');
const marker = layout === 'variant' ? instance.getBoolean('show-marker-[layout=variant]') : false;
const showTrend = layout === 'embedded' ? instance.getBoolean('show-trend-[layout=embedded]') : instance.getBoolean('show-trend-[layout=standalone]');
const trendInstance = showTrend ? instance.getInstanceSwap('trend') : undefined;
const trend = trendInstance?.type === 'INSTANCE' ? trendInstance.executeTemplate().metadata?.props?.trend : undefined;
// Native exposes help visibility only. The label is a display-safe placeholder; replace it with product explanation.
const helpProp = showHelp ? figma.code`help="${label}"` : '';
const captionProp = showHint ? figma.code`caption="${hint}"` : '';
const trendProp = trend ? figma.code`trend={${trend}}` : '';
const fields = figma.code`label: "${label}", value: "${value}", state: "${state}", ${showHint ? figma.code`caption: "${hint}",` : ''} ${showHelp ? figma.code`help: "${label}",` : ''} ${trend ? figma.code`trend: ${trend},` : ''} selectable: ${state !== 'static'}`;
export default {
 id:'metric-tile', imports:['import { MetricTile } from "@inova-lab-ws/ui"'],
 example:figma.code`<MetricTile context="${context}" layout="${codeLayout}" state="${state}" label="${label}" value="${value}" ${captionProp} ${helpProp} ${trendProp} ${marker ? '' : 'marker={false}'} />`,
 metadata:{nestable:true,props:{label,value,state,fields,helpRequiresProductCopy:showHelp}}
};
