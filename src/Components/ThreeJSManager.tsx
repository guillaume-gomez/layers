import React, { useState } from "react";
import * as THREE from 'three';
import ThreeJsRendering from "./ThreeJsRendering";
import ColorPicker from "./ColorPicker";
import Slider from "./Slider";

interface ThreeJSManagerProps {
 layers: string[];
 width: number;
 height: number;
}

function ThreeJSManager({ layers, width, height }: ThreeJSManagerProps) {
  const [backgroundColor3D, setBackgroundColor3D] = useState<string>("#000000");
  const [zOffset, setZOffset] = useState<number>(0.2);
  const [opacityLayer, setOpacityLayer] = useState<number>(0.9);

  return (
    <div className="flex flex-col gap-3">
      <ColorPicker label="Background color 3D" value={backgroundColor3D} onChange={(color) => setBackgroundColor3D(color)}/>
      <Slider
        label="Space between layers"
        onChange={(value) => setZOffset(value)}
        value={zOffset}
        float
        step={0.01}
        min={0.1}
        max={3}
      />
      <Slider
        label="Opacity of a Layer"
        onChange={(value) => setOpacityLayer(value)}
        value={opacityLayer}
        float
        step={0.01}
        min={0.01}
        max={0.99}
      />
      <ThreeJsRendering
        layers={layers}
        width={width}
        height={height}
        backgroundColor={backgroundColor3D}
        zOffset={zOffset}
        opacityLayer={opacityLayer}
      />
    </div>
  )
}

export default ThreeJSManager;

