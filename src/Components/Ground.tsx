import * as THREE from 'three'
import React, { useRef, useEffect } from 'react';
import { ThreeElements, useLoader } from '@react-three/fiber';
import { Reflector, Text, useTexture, useGLTF, MeshReflectorMaterial } from '@react-three/drei'



function Ground() {
  const [floor, normal] = useTexture(['/GroundText.jpg', '/GroundNormal.jpg'])
  return <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            mirror={0}
            resolution={1024}
            mixBlur={1}
            mixStrength={15}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#151515"
            metalness={0.8}
            roughness={1}
          />
        </mesh>
  /*return (
    <Reflector
      blur={[400, 100]}
      resolution={512}
      args={[10, 10]}
      mirror={0.5}
      mixBlur={6}
      mixStrength={1.5}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
     >
      {
        (Material, props) => (
        <Material
          color="#a0a0a0"
          metalness={0.4}
          roughnessMap={floor}
          normalMap={normal}
          normalScale={[2, 2] as any}
          {...props}
        />)
      }
    </Reflector>
  )*/
}

export default Ground;