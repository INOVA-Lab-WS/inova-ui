import figma from "@figma/code-connect";
import { ImageViewer, ImageViewerAction } from "../src";

figma.connect(ImageViewer, "https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library?node-id=907-904", {
  example: () => (
    <ImageViewer
      open
      onOpenChange={() => {}}
      images={[{ src: "/cena.jpg", alt: "Sala com porcelanato amadeirado" }]}
      actions={<><ImageViewerAction>Ver produtos</ImageViewerAction><ImageViewerAction>Baixar</ImageViewerAction></>}
    />
  ),
});
