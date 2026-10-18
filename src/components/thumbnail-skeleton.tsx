import * as React from "react";
import { Thumbnail, type ThumbnailAppearance, type ThumbnailSize, type ThumbnailAspectRatio } from "./thumbnail";
import { Skeleton } from "./skeleton";

export interface ThumbnailSkeletonProps extends React.HTMLAttributes<HTMLElement> {
  appearance?: ThumbnailAppearance;
  size?: ThumbnailSize;
  aspectRatio?: ThumbnailAspectRatio;
  captionLines?: 1 | 2 | 3;
  showMetadata?: boolean;
  showAuthor?: boolean;
  showFooter?: boolean;
}

/** Uses the actual Thumbnail frame and media so loading and loaded geometry match. */
export function ThumbnailSkeleton({ appearance, size, aspectRatio, captionLines = 2, showMetadata = true, showAuthor, showFooter, ...props }: ThumbnailSkeletonProps) {
  return <Thumbnail {...props} appearance={appearance} size={size} aspectRatio={aspectRatio} aria-busy="true"
    fallback={<Skeleton className="size-full rounded-none" />}
    caption={<span aria-hidden="true" className="flex flex-col gap-1">{Array.from({ length: captionLines }, (_, index) => <Skeleton key={index} shape="text" className={index === captionLines - 1 ? "w-3/4" : "w-full"} />)}</span>}
    metadata={showMetadata ? <Skeleton shape="text" className="mt-1 w-1/2" /> : undefined}
    author={showAuthor ? <span aria-hidden="true" className="flex items-center gap-1.5"><Skeleton shape="circle" className="size-6" /><Skeleton shape="text" className="w-2/3" /></span> : undefined}
    footer={showFooter ? <Skeleton shape="text" className="w-1/2" /> : undefined}
  />;
}
