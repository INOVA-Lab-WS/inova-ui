// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=620-3967
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/menu.tsx
// component=Menu
import figma from 'figma';
const instance = figma.selectedInstance;
const presentation = instance.getEnum('presentation', { collapsed:'collapsed', fullscreen:'fullscreen', expanded:'expanded', 'collapsed-hover':'collapsed', responsive:'responsive' });
const logo = instance.getSlot('logo');
const navigation = instance.getSlot('navigation');
const footer = instance.getSlot('footer');
const showFooter = instance.getBoolean('show-footer');
// collapsed-hover is the native hover preview of collapsed; viewport previews the responsive CSS layout.
// Mount Header and this Menu under the same MenuProvider to share automatic mobile open/close state.
export default {
 id:'menu', imports:['import { Menu } from "@inova-lab-ws/ui"'],
 example:figma.code`<Menu presentation="${presentation}" logo={<>${logo}</>} navigation={<>${navigation}</>} ${showFooter ? figma.code`footer={<>${footer}</>}` : 'showFooter={false}'} />`,
 metadata:{nestable:true}
};

