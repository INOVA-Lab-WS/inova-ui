// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1142-957
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/author-line.tsx
// component=AuthorLine
import figma from 'figma';
const instance = figma.selectedInstance;
const name = instance.getString('name');
const store = instance.getString('store');
const showStore = instance.getEnum('show-store', {'true':true,'false':false});
// AuthorLine owns its small Avatar; name drives its initial. Photo src is application data.
export default {
 id:'author-line', imports:['import { AuthorLine } from "@inova-lab-ws/ui"'],
 example:figma.code`<AuthorLine name="${name}" ${showStore ? figma.code`store="${store}"` : ''} />`,
 metadata:{nestable:true}
};
