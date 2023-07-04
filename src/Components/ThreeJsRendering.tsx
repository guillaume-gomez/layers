import React, { useRef , useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, PresentationControls, Stats, AsciiRenderer, ContactShadows,  Grid, Stage, Backdrop, Lightformer } from '@react-three/drei';
import { useFullscreen } from "rooks";
import ThreeJsLayer from "./ThreeJsLayer";
import { position2D, LayersBase64Data } from "../interfaces";
import Ground from "./Ground";

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
  const [fakeSelectedLayer, setFakeSelectedLayer] = useState<number>(-1);
/*
  useEffect(() => {
    const fakeSelected = Math.ceil(Math.random() * layers.length);
    setFakeSelectedLayer(fakeSelected);
  }, [layers, setFakeSelectedLayer])*/

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


        <hemisphereLight intensity={0.5} />
      <ContactShadows resolution={1024} frames={1} position={[0, -1.16, 0]} scale={15} blur={0.5} opacity={1} far={20} />
      <mesh scale={4} position={[3, -1.161, -1.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 4, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <mesh scale={4} position={[-3, -1.161, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 3, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-30, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[30, 2, 0]} scale={[100, 2, 1]} />
        {/* Key */}
        <Lightformer form="ring" color="red" intensity={10} scale={2} position={[10, 10, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        <PresentationControls
          snap
          global
          zoom={0.5}
          rotation={[0, 0, 0]}
          polar={[-Math.PI/ 8, Math.PI / 4]}
          azimuth={[-Math.PI, Math.PI]}
        >

           {/* <Backdrop
              floor={1} // Stretches the floor segment, 0.25 by default
              segments={20} // Mesh-resolution, 20 by default
              receiveShadow={true}
              position={[0,-0.6,-1]}
              scale={[2,1,1]}
            >
                <meshStandardMaterial color="#FFFFFF" />
            </Backdrop>*/}
          <group
            position={[
              0
              ,0,
              0]}
          >
              <Ground />
            {
              positions2d.map((position2d, index) => {
                return <ThreeJsLayer
                          key={index}
                          base64Texture={layers[index].layerBase64}
                          opacity={opacityLayer}
                          position={[position2d.x , position2d.y, -sizeOfLayersZ + (index  * zOffset)]}
                          isSelected={index === fakeSelectedLayer}
                       />
              })
            }
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