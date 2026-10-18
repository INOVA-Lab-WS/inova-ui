// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1140-1939
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/forecast-card.tsx
// component=ForecastCard
import figma from "figma";
const instance=figma.selectedInstance;
const targetStatus=instance.getEnum('target-status',{met:'met',below:'below',neutral:'neutral'});
const valueTone=instance.getEnum('value-tone',{neutral:'neutral',negative:'negative'});
const state=instance.getEnum('state',{data:'data',missing:'missing'});
const period=instance.getString('period');
const description=instance.getString('description');
const value=instance.getString('value');
const low=instance.getString('range-low');
const high=instance.getString('range-high');
const target=instance.getString('target');
const targetBadge=instance.findInstance('target evaluation / editable Badge');
const targetLabel=targetBadge.type==='INSTANCE'?targetBadge.executeTemplate().metadata?.props?.label:undefined;
const b00=instance.findInstance('origin Badge / group0 item0');
const b01=instance.findInstance('origin Badge / group0 item1');
const b10=instance.findInstance('origin Badge / group1 item0');
const b11=instance.findInstance('origin Badge / group1 item1');
const p00=b00.type==='INSTANCE'?b00.executeTemplate().metadata?.props:undefined;
const p01=b01.type==='INSTANCE'?b01.executeTemplate().metadata?.props:undefined;
const p10=b10.type==='INSTANCE'?b10.executeTemplate().metadata?.props:undefined;
const p11=b11.type==='INSTANCE'?b11.executeTemplate().metadata?.props:undefined;
const g0=instance.getString('group-0-label');
const g1=instance.getString('group-1-label');
const t0=instance.getString('group-0-total');
const t1=instance.getString('group-1-total');
const v00=instance.getString('group-0-item-0-value');
const v01=instance.getString('group-0-item-1-value');
const v10=instance.getString('group-1-item-0-value');
const v11=instance.getString('group-1-item-1-value');
// Display strings remain exact, including PT-BR currency; applications own arithmetic and formatting.
const items0=figma.code`[${p00?figma.code`{label:"${p00.label}",color:"${p00.color}",value:"${v00}"},`:''}${p01?figma.code`{label:"${p01.label}",color:"${p01.color}",value:"${v01}"}`:''}]`;
const items1=figma.code`[${p10?figma.code`{label:"${p10.label}",color:"${p10.color}",value:"${v10}"},`:''}${p11?figma.code`{label:"${p11.label}",color:"${p11.color}",value:"${v11}"}`:''}]`;
const breakdown=figma.code`[{label:"${g0}",total:"${t0}",items:${items0}},{label:"${g1}",total:"${t1}",items:${items1}}]`;
export default {
 id:'forecast-card',imports:['import { ForecastCard } from "@inova-lab-ws/ui"'],
 example:figma.code`<ForecastCard period="${period}" description="${description}" value={${state==='missing'?figma.code`null`:figma.code`"${value}"`}} valueTone="${valueTone}" ${instance.getBoolean('show-range')?figma.code`range={{low:"${low}",high:"${high}"}}`:''} ${instance.getBoolean('show-target')?figma.code`target="${target}"`:''} ${instance.getBoolean('show-target-status')&&targetLabel?figma.code`targetStatus={{label:"${targetLabel}",status:"${targetStatus}"}}`:''} ${instance.getBoolean('show-breakdown')?figma.code`breakdown={${breakdown}}`:''} />`,
 metadata:{nestable:true,props:{state,valueTone,targetStatus,dataIsCallerOwned:true}}
};
