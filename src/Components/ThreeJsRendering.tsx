import React, { useRef , useMemo, useState, useEffect } from 'react';
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing'
import { Canvas } from '@react-three/fiber';
import { CameraControls, PresentationControls, Stats, AsciiRenderer, Grid } from '@react-three/drei';
import { useFullscreen } from "rooks";
import ThreeJsLayer from "./ThreeJsLayer";
import { position2D, LayersBase64Data } from "../interfaces";
import { useSelectedLayer } from "../Reducers/useSelectedLayersSettings";


interface ThreejsRenderingProps {
  layers: LayersBase64Data[];
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
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });
  const { selectedLayer } = useSelectedLayer();

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

  if(layers.length != positions2d.length) {
    // in case of reconcilation of the two arrays is not yet
    return <span className="loading loading-bars loading-lg"></span>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <Canvas
        camera={{ position: [0, 0.0, 1], fov: 75, far: 10 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
        style={{width, height}}
      >

        { 
          import.meta.env.MODE === "development" ? 
          <>
          <Stats showPanel={0} /> 
          <Grid sectionColor={0x987654} cellSize={1} args={[10, 10]} />
          </> : <></>
        }
        <color attach="background" args={[colorToSigned24Bit(backgroundColor)]} />

        <pointLight position={[0, 0, 10]} intensity={1.5} color={0xAAAADD}/>
        <pointLight position={[0, 0, -10]} intensity={0.5}  color={0xDDAAAA} />

        <directionalLight position={[-10, .5, 5]} intensity={0.5} color={0xFFFFFF} />
        <directionalLight position={[10, 0.5, 5]} intensity={0.5} color={0xFFFFFF} />

        <PresentationControls
          snap
          global
          zoom={0.5}
          rotation={[0, 0, 0]}
          polar={[-Math.PI/ 8, Math.PI / 4]}
          azimuth={[-Math.PI, Math.PI]}
        >
          <group
            position={[
              0
              ,0,
              0]}
          >
            <Selection>
              <EffectComposer multisampling={8} autoClear={false}>
                <Outline blur visibleEdgeColor={0xffffff} hiddenEdgeColor={0x22090a} edgeStrength={100} pulseSpeed={0.8} />
              </EffectComposer>
              {
                positions2d.map((position2d, index) => {
                  return <ThreeJsLayer
                            key={index}
                            base64Texture={layers[index].layerBase64}
                            opacity={opacityLayer}
                            position={[position2d.x , position2d.y, -sizeOfLayersZ + (index  * zOffset)]}
                            isSelected={layers[index].id === selectedLayer}
                         />
                })
              }
            </Selection>
          </group>
        </PresentationControls>
        { /* <AsciiRenderer fgColor="white" bgColor="black" /> */}
      </Canvas>
      <ul className="text-xs">
        <li>Double click to switch to fullscreen</li>
        <li>Use your mouse or finger to move the camera</li>
      </ul>
    </div>
  );
}

export default ThreejsRendering;