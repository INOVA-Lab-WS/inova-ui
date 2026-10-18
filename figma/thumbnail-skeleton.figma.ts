// url=https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=1144-1415
// source=https://github.com/INOVA-Lab-WS/inova-ui/blob/main/src/components/thumbnail-skeleton.tsx
// component=ThumbnailSkeleton
import figma from 'figma';
const instance = figma.selectedInstance;
const appearance = instance.getEnum('appearance', {default:'default',frameless:'frameless'});
const size = instance.getEnum('size', {default:'default',compact:'compact'});
const aspectRatio = instance.getEnum('aspect-ratio', {'1:1':'1:1','4:3':'4:3'});
const captionLines = instance.getEnum('caption-lines', {'1':1,'2':2,'3':3});
const showMetadata = instance.getBoolean('showMetadata');
const showAuthor = instance.getBoolean('showAuthor');
const showFooter = instance.getBoolean('showFooter');
// Skeleton children are owned internally by ThumbnailSkeleton; native geometry maps through public props.
export default {
 id:'thumbnail-skeleton', imports:['import { ThumbnailSkeleton } from "@inova-lab-ws/ui"'],
 example:figma.code`<ThumbnailSkeleton appearance="${appearance}" size="${size}" aspectRatio="${aspectRatio}" captionLines={${captionLines}} ${showMetadata ? 'showMetadata' : 'showMetadata={false}'} ${showAuthor ? 'showAuthor' : ''} ${showFooter ? 'showFooter' : ''} />`,
 metadata:{nestable:true}
};
