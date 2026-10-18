// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1142-964
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/see-all.tsx
// component=SeeAll
import figma from 'figma';
const instance = figma.selectedInstance;
const label = instance.getString('label');
// SeeAll owns its trailing ArrowRight. Native state=default is a visual preview, not a runtime prop.
// Supply href or an asChild router Link from application navigation; native exposes no route property.
export default {
 id:'see-all', imports:['import { SeeAll } from "@inova-lab-ws/ui"'],
 example:figma.code`<SeeAll>${label}</SeeAll>`,
 metadata:{nestable:true}
};
