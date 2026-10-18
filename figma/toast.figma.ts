// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=458-124
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/toast.tsx
// component=Toast
import figma from 'figma';
const instance = figma.selectedInstance;
const kind = instance.getEnum('kind', { success:'success', error:'error', info:'info' });
const message = kind === 'success' ? instance.getString('message-·-success') : kind === 'error' ? instance.getString('message-·-error') : instance.getString('message-·-info');
const showAction = instance.getBoolean('show-action');
const actionNode = showAction ? instance.findInstance('action') : undefined;
const actionLabel = actionNode?.type === 'INSTANCE' ? actionNode.getString('label') : undefined;
// Toast owns its action Button and close control; map editable Button text into the ToastAction input.
// Replace action/onDismiss callbacks with application behavior. Without show-action, no close control is emitted.
// viewport is a native preview. Use ToastViewport for responsive fixed positioning.
export default {
 id:'toast', imports:['import { Toast } from "@inova-lab-ws/ui"'],
 example:figma.code`<Toast kind="${kind}" ${showAction && actionLabel !== undefined ? figma.code`action={{ label: "${actionLabel}", onClick: () => {} }} onDismiss={() => {}}` : ''}>${message}</Toast>`,
 metadata:{nestable:true}
};

