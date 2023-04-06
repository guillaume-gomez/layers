import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSpring, animated } from '@react-spring/three';
import React, { useRef, useEffect } from 'react';
import { ThreeElements, useLoader } from '@react-three/fiber';

interface ThreeJsStripeProps {
  base64Texture: string;
  meshProps: ThreeElements['mesh'];
}


function ThreeJsLayer({meshProps, base64Texture }: ThreeJsStripeProps) {
  const [{ position }, api] = useSpring<any>(() =>({
    from: meshProps.position,
    position: meshProps.position,
    config: { mass: 0.5, tension: 500, friction: 150, precision: 0.0001 }
  }))
  useEffect(() => {
    api.start({ to: {position: meshProps.position}})
  }, [meshProps, api])
 
  const mesh = useRef<THREE.Mesh>(null!);
  //useFrame((state, delta) => (mesh.current.rotation.x += delta));
  const [texture] = useLoader(TextureLoader, [
    base64Texture
  ]);


  if(!texture) {
    return <></>;
  }

  return (
    <animated.mesh
      position={position as any}
      ref={mesh}
      /*{...meshProps}*/
    >
      <boxGeometry args={[1, 1, 0.1]} />
      <meshPhongMaterial map={texture} opacity={0.9} transparent/>

    </animated.mesh>
  )
}

export default ThreeJsLayer;