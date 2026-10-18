// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=59-28
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/badge.tsx
// component=Badge
import figma from "figma";
const instance=figma.selectedInstance;
const color=instance.getEnum('color',{green:'green',beige:'beige',yellow:'yellow',red:'red',blue:'blue',disabled:'disabled',category1:'category1',category2:'category2',category3:'category3',category4:'category4',category5:'category5'});
const tone=instance.getEnum('tone',{dark:'dark',light:'light'});
const label=instance.getString('label');
const icon=instance.getBoolean('show-icon')?instance.getInstanceSwap('icon'):undefined;
const iconCode=icon?.type==='INSTANCE'?icon.executeTemplate().example:undefined;
export default {
 id:'badge',imports:['import { Badge } from "@inova-lab-ws/ui"'],
 example:figma.code`<Badge color="${color}" tone="${tone}" ${iconCode?figma.code`icon={${iconCode}}`:''}>${label}</Badge>`,
 metadata:{nestable:true,props:{label,color,tone}}
};
