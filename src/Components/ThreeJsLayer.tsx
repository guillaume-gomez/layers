import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSpring, animated } from '@react-spring/three';
import React, { useRef, useEffect, useState } from 'react';
import { ThreeElements, useLoader } from '@react-three/fiber';
import {  Select } from '@react-three/postprocessing'



interface ThreeJsStripeProps {
  base64Texture: string;
  meshProps?: ThreeElements['mesh'];
  position: [number, number, number];
  opacity?: number;
  isSelected: boolean;
}


function ThreeJsLayer({meshProps, base64Texture, position, opacity = 0.9, isSelected = false }: ThreeJsStripeProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [{ x, y, z }] = useSpring(() => ({ to: { x: position[0] + 0, y: position[1] + 0, z: position[2] + 0.1 } }), [position]);


  const mesh = useRef<THREE.Mesh>(null!);
  const [texture] = useLoader(TextureLoader, [
    base64Texture
  ]);

  if(!texture) {
    return <></>;
  }

  return (
    <Select enabled={hovered || isSelected}>
      <animated.mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}

        position-x={x}
        position-y={y}
        position-z={z}
        ref={mesh}
        /*{...meshProps}*/
      >
        <boxGeometry args={[1, 1, 0.1]} />
        <meshPhongMaterial map={texture} opacity={opacity} transparent shininess={80}/>
      </animated.mesh>
    </Select>
  )
}

export default ThreeJsLayer;