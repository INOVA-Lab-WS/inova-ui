// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=135-743
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/header.tsx
// component=Header
import figma from 'figma';
const instance = figma.selectedInstance;
const viewport = instance.getEnum('viewport', { mobile:'mobile', tablet:'tablet', desktop:'desktop' });
const composition = instance.getEnum('composition', { 'app-header':'app-header', 'action-header':'action-header', menu64:'menu64' });
const menuLabel = instance.getString('menu-close-accessible-name');
const logo = instance.getSlot('logo');
const showRight = instance.getBoolean('show-right-slot');
const avatarNode = showRight ? instance.findInstance('session-avatar') : undefined;
const avatar = avatarNode?.type === 'INSTANCE' ? avatarNode.executeTemplate().example : undefined;
const leadingNode = composition === 'action-header' ? instance.getInstanceSwap('leading-action-icon') : undefined;
const leading = leadingNode?.type === 'INSTANCE' ? leadingNode.executeTemplate().example : undefined;
const trailingNode = composition === 'action-header' && showRight ? instance.getInstanceSwap('trailing-action-icon') : undefined;
const trailing = trailingNode?.type === 'INSTANCE' ? trailingNode.executeTemplate().example : undefined;
// Native menu64 is Menu's fullscreen top bar, not a Header API. menu-close-focused is only a focus preview.
// Custom leading/trailing actions require the application's accessible labels and callbacks.
export default {
 id:'header', imports:['import { Header } from "@inova-lab-ws/ui"'],
 example:figma.code`<Header viewport="${viewport}" menuLabel="${menuLabel}" logo={<>${logo}</>} ${leading ? figma.code`leadingAction={${leading}}` : ''} ${!showRight ? 'rightSlot={null}' : trailing ? figma.code`rightSlot={${trailing}}` : avatar ? figma.code`rightSlot={${avatar}}` : ''} />`,
 metadata:{nestable:true}
};

