import * as THREE from 'three'
import React from 'react';


interface TwoDimensionRenderingProps {
    layers: string[];

}

function TwoDimensionRendering({ layers }: TwoDimensionRenderingProps) {
    return (
    <div>
        <div className="relative">
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

