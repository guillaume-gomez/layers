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

  return (
    <div className="flex flex-col gap-3">
      <ColorPicker label="Background color 3D" value={backgroundColor3D} onChange={(color) => setBackgroundColor3D(color)}/>
      <ThreeJsRendering width={width} height={height} backgroundColor={backgroundColor3D} layers={layers}/>
    </div>
  )
}

export default ThreeJSManager;

