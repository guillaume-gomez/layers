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
  const [backgroundColorImage, setBackgroundColorImage] = useState<string>("#000000");
  const anchorRef = useRef<HTMLAnchorElement>(null);

  async function saveImage() {
    if(anchorRef.current) {
      const dataURL = await mergeImages(layers, width, height, backgroundColorImage);
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      anchorRef.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      (anchorRef.current as any).download = `${dateString}-risography.png`;
      anchorRef.current.click();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <ColorPicker
        label="Background color image"
        value={backgroundColorImage}
        onChange={(color) => setBackgroundColorImage(color)}
      />
      <TwoDimensionRendering layers={layers} height={height || 100} />
      <div className="self-end">
        <a
          className="btn btn-lg btn-accent"
          ref={anchorRef}
          onClick={saveImage}
        >
            Save the image 📷
        </a>
      </div>
    </div>
  )
}

export default Canvas2DManager;

