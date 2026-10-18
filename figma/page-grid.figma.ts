// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1122-1692
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/page-grid.tsx
// component=PageGrid
import figma from 'figma';
const instance = figma.selectedInstance;
const loadState = instance.getEnum('loadState', {idle:'idle',loading:'loading',error:'error',end:'end'});
const content = instance.getSlot('content');
const errorMessage = instance.getString('errorMessage');
const endMessage = instance.getString('endMessage');
// Replace callbacks with application pagination/retry; update loadKey after every consumed page.
// Native footer buttons and loading skeleton are rendered internally by PageGrid, not passed as children.
export default {
 id:'page-grid', imports:['import { PageGrid } from "@inova-lab-ws/ui"'],
 example:figma.code`<PageGrid loadState="${loadState}" errorMessage="${errorMessage}" endMessage="${endMessage}" onLoadMore={() => {}} onRetry={() => {}}>${content}</PageGrid>`,
 metadata:{nestable:true}
};
