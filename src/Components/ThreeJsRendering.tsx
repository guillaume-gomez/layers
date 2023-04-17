import React, { useRef , useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useFullscreen } from "rooks";
import ThreeJsLayer from "./ThreeJsLayer";

interface ThreejsRenderingProps {
  layers: string[];
  width: number;
  height: number;
  backgroundColor: string;
  zOffset?: number
}

function ThreejsRendering({ layers, width, height, backgroundColor, zOffset = 0.1 } : ThreejsRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });

  // before layers are cut
  if(layers.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <p>Upload an image to see the final result</p>
        <canvas style={{ background: backgroundColor, width, height }}/>
      </div>
    );
  }

  function colorToSigned24Bit(stringColor: string) : number {
    return (parseInt(stringColor.substr(1), 16) << 8) / 256;
  }

  console.log(zOffset);

  return (
    <div className="flex flex-col gap-5 w-full">
      <Canvas
        camera={{ position: [0, 0.0, 1], fov: 75, far: 5 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
        style={{width, height}}
      >
        <color attach="background" args={[colorToSigned24Bit(backgroundColor)]} />
        <OrbitControls makeDefault />
        <pointLight position={[10, 10, 10]} />
        <group
          position={[
            0
            , 0,
            0]}
        >
          {
            layers.map((layerBase64, index) => {
              return <ThreeJsLayer
                        key={index}
                        base64Texture={layerBase64}
                        meshProps={{position:[0 ,0, index  * zOffset]}}
                     />
            })
          }
        </group>
      </Canvas>
      <ul className="text-xs">
        <li>Double click to switch to fullscreen</li>
        <li>Use your mouse or finger to move the camera</li>
      </ul>
    </div>
  );
}

export default ThreejsRendering;