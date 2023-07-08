import * as THREE from 'three'
import React from 'react';
import { ThreeElements, useLoader } from '@react-three/fiber';
import { Reflector, Text, useTexture, useGLTF, MeshReflectorMaterial } from '@react-three/drei'

interface StriplightProps {
  position: [number, number, number];
  scale: [number, number, number];
}



function Striplight({position, scale} : StriplightProps) {
  return (
    <mesh 
      position={position}
      scale={scale}>
      <boxGeometry />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}

export default Striplight;