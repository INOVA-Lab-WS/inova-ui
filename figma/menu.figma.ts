// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=620-3967
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/menu.tsx
// component=Menu
import figma from 'figma';
const instance = figma.selectedInstance;
const nativePresentation = instance.getEnum('presentation', { collapsed:'collapsed', fullscreen:'fullscreen', expanded:'expanded', 'collapsed-hover':'collapsed-hover', responsive:'responsive' });
const presentation = nativePresentation === 'collapsed-hover' ? 'collapsed' : nativePresentation;
// The legacy collapsed-hover preview has no valid native SLOT defaults; keep its slots application-supplied.
const hasNativeSlots = nativePresentation !== 'collapsed-hover';
const logo = hasNativeSlots ? instance.getSlot('logo') : undefined;
const navigation = hasNativeSlots ? instance.getSlot('navigation') : undefined;
const footer = hasNativeSlots ? instance.getSlot('footer') : undefined;
const showFooter = instance.getBoolean('show-footer');
// collapsed-hover is the native hover preview of collapsed; viewport previews the responsive CSS layout.
// Mount Header and this Menu under the same MenuProvider to share automatic mobile open/close state.
export default {
 id:'menu', imports:['import { Menu } from "@inova-lab-ws/ui"'],
 example:figma.code`<Menu presentation="${presentation}" ${logo ? figma.code`logo={<>${logo}</>}` : ''} ${navigation ? figma.code`navigation={<>${navigation}</>}` : ''} ${showFooter && footer ? figma.code`footer={<>${footer}</>}` : 'showFooter={false}'} />`,
 metadata:{nestable:true}
};

