import * as THREE from 'three'
import React, { useRef, useEffect } from 'react';
import { ThreeElements, useLoader } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei'



function Ground() {
  return <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry
              args={[50, 50]}
            />
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
}

export default Ground;
