import React, { useState, useRef } from "react";
import { format as formatFns } from "date-fns";
import { mergeImages } from "../tools";
import TwoDimensionRendering from "./TwoDimensionRendering";
import ColorPicker from "./ColorPicker";
import Slider from "./Slider";

interface Canvas2DManagerProps {
 layers: string[];
 width: number;
 height: number;
}

function Canvas2DManager({ layers, width, height }: Canvas2DManagerProps) {
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const [backgroundColorImage, setBackgroundColorImage] = useState<string>("#000000");
  const anchorRef = useRef<HTMLAnchorElement>(null);

  async function saveImage() {
    setIsSavingImage(true);
    console.log("savin")
    if(anchorRef.current) {
      const dataURL = await mergeImages(layers, width, height, backgroundColorImage);
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      (anchorRef.current as any).download = `${dateString}-risography.png`;
      anchorRef.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      setIsSavingImage(false);
      console.log("jdkfjkdjfk")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span> Mettre un load {isSavingImage.toString()}</span>
      <a
        className="btn btn-accent"
        ref={anchorRef}
        onClick={saveImage}
      >
          Save the image
      </a>
      <ColorPicker
        label="Background color image"
        value={backgroundColorImage}
        onChange={(color) => setBackgroundColorImage(color)}
      />
      <TwoDimensionRendering layers={layers} height={height || 100} />
    </div>
  )
}

export default Canvas2DManager;

