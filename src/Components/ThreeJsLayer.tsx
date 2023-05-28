import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSpring, animated, Globals } from '@react-spring/three';
import React, { useRef, useEffect } from 'react';
import { ThreeElements, useLoader } from '@react-three/fiber';

Globals.assign({
  frameLoop: "always",
});

interface ThreeJsStripeProps {
  base64Texture: string;
  meshProps?: ThreeElements['mesh'];
  position: [number, number, number];
  opacity?: number;
}


function ThreeJsLayer({meshProps, base64Texture, position, opacity = 0.9 }: ThreeJsStripeProps) {
  // bad example https://codesandbox.io/s/try-to-do-zgit5?file=/src/App.js:1254-1857
  // to fix here is an example https://codesandbox.io/s/try-to-do-forked-gwy21?file=/src/App.js
/*  const [{ position }, api] = useSpring<any>(() =>({
    from: {position: meshProps.position},
    position: meshProps.position,
    config: { mass: 0.5, tension: 500, friction: 150, precision: 0.0001 }
  }), [meshProps])*/

  const [{ x, y, z }] = useSpring(() => ({ to: { x: position[0] + 0, y: position[1] + 0, z: position[2] + 0.1 } }), [position]);


  const mesh = useRef<THREE.Mesh>(null!);
  const [texture] = useLoader(TextureLoader, [
    base64Texture
  ]);

  if(!texture) {
    return <></>;
  }

  return (
    <animated.mesh
      position-x={x}
      position-y={y}
      position-z={z}
      ref={mesh}
      /*{...meshProps}*/
    >
      <boxGeometry args={[1, 1, 0.1]} />
      <meshPhongMaterial map={texture} opacity={opacity} transparent shininess={80}/>
    </animated.mesh>
  )
}

export default ThreeJsLayer;