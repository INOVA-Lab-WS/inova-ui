// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=763-516
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/page-header.tsx
// component=PageHeader
import figma from 'figma';
const instance = figma.selectedInstance;
const title = instance.getString('title');
const description = instance.getString('subtitle');
const size = instance.getEnum('size', {page:'page',section:'section'});
const showAction = instance.getBoolean('show-action');
const showTabs = instance.getBoolean('show-tabs');
const actionNode = showAction ? instance.findInstance('action-button') : undefined;
const action = actionNode?.type === 'INSTANCE' ? actionNode.executeTemplate().example : undefined;
const tabs = showTabs ? instance.findLayers(n => n.type === 'INSTANCE' && n.name === 'chip') : [];
const tab0 = tabs[0]?.type === 'INSTANCE' ? tabs[0].executeTemplate().example : undefined;
const tab1 = tabs[1]?.type === 'INSTANCE' ? tabs[1].executeTemplate().example : undefined;
const tab2 = tabs[2]?.type === 'INSTANCE' ? tabs[2].executeTemplate().example : undefined;
// viewport is a native responsive preview; PageHeader responds through CSS.
export default {
 id: 'page-header', imports: ['import { PageHeader } from "@inova-lab-ws/ui"'],
 example: figma.code`<PageHeader size="${size}" title="${title}" description="${description}" ${action ? figma.code`action={${action}}` : ''} ${showTabs ? figma.code`tabs={<>${tab0}${tab1}${tab2}</>}` : ''} />`,
 metadata: { nestable: true }
};

