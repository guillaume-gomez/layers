import * as THREE from 'three'
import React from 'react';


interface TwoDimensionRenderingProps {
    layers: string[];
    height: number;
}

function TwoDimensionRendering({ layers, height }: TwoDimensionRenderingProps) {
    return (
    <div style={{ height }}>
        <div className="">
            {
             layers.map( (layerBase64, index) =>
              <img className="absolute" key={index} src={layerBase64} />
             )
            }
        </div>
    </div>

  )
}

export default TwoDimensionRendering;

