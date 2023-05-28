import React, { useRef , useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { useFullscreen } from "rooks";
import ThreeJsLayer from "./ThreeJsLayer";
import { position2D } from "../interfaces";

interface ThreejsRenderingProps {
  layers: string[];
  positions2d: position2D[];
  width: number;
  height: number;
  backgroundColor: string;
  opacityLayer?: number;
  zOffset?: number
  zCamera: number;
 }

function ThreejsRendering({ layers, width, height, backgroundColor,  positions2d , zCamera, zOffset = 0.1, opacityLayer = 0.9 } : ThreejsRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraControlRef = useRef<any>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });

  function colorToSigned24Bit(stringColor: string) : number {
    return (parseInt(stringColor.substr(1), 16) << 8) / 256;
  }

  // before layers are cut
  if(layers.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <p>Upload an image to see the final result</p>
        <canvas style={{ background: backgroundColor, width, height }}/>
      </div>
    );
  }

  const sizeOfLayersZ = layers.length * zOffset;
  const middleSizeOfLayersZ = sizeOfLayersZ / 2;

  return (
    <div className="flex flex-col gap-5 w-full">
      <button
          type="button"
          onClick={() => {
            cameraControlRef.current?.rotate(Math.PI / 4, 0, true);
          }}
        >
          Rotate 45% on X
        </button>
      <Canvas
        camera={{ position: [0, 0.0, 1], fov: 75, far: 10 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
        style={{width, height}}
      >
        <color attach="background" args={[colorToSigned24Bit(backgroundColor)]} />

        <pointLight position={[0, 0, 10]} intensity={1.5} color={0xDDDDDD}/>
        <pointLight position={[0, 0, -10]} intensity={0.5}  color={0xDDDDDD} />

        <directionalLight position={[-10, .5, 5]} intensity={0.5} color={0xe1d014} />
        <directionalLight position={[10, 0.5, 5]} intensity={0.5} color={0xe1d014} />

        <CameraControls makeDefault ref={cameraControlRef} />

        <group
          position={[
            0
            ,0,
            0]}
        >
          {
            positions2d.map((position2d, index) => {
              return <ThreeJsLayer
                        key={index}
                        base64Texture={layers[index]}
                        opacity={opacityLayer}
                        position={[position2d.x , position2d.y, -middleSizeOfLayersZ + (index  * zOffset)]}
                        /*meshProps={{position:[0 ,0, -middleSizeOfLayersZ + (index  * zOffset)]}}*/
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