import { useState, useRef, useEffect } from 'react'
import sample from './assets/sample.png';
import { imageToGrayScaleCanvas, generateImageFromRange } from "./tools";
import Slider from "./Components/Slider";


import './App.css'

const possibleColors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFFFF"];

function App() {
  const [numberOfLayers, setNumberOfLayer] = useState<number>(2);
  const [layers, setLayers] = useState<HTMLCanvasElement[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    //generateImagesFromLayers();
  }, [numberOfLayers]);

  function generateImagesFromLayers() {
    if(!canvasRef.current) {
      return;
    }

    //const layerThresholdRange = 255 % numberOfLayers;
    const layerThresholdRange = 127;
    let canvas : HTMLCanvasElement[] = [];
    for(let i = 0; i < numberOfLayers; i++) {
      console.log(`( ${i} , ${i + layerThresholdRange})`);
      canvas.push(generateImageFromRange(canvasRef.current, i * layerThresholdRange, (i + 1) * layerThresholdRange));
    }

    setLayers(canvas);


  }

  function percentageOfColors() {

  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Bonjour</h1>
      <Slider
        label="Number of layer"
        onChange={(value) => setNumberOfLayer(value)}
        value={numberOfLayers
        }
        min={2}
        max={12}
      />
      <div className="container">
        <img ref={imageRef} src={sample} />
        <canvas ref={canvasRef} />
        <button
          onClick={() => {
            if(canvasRef.current && imageRef.current) {
              imageToGrayScaleCanvas(imageRef.current, canvasRef.current)
            }
          }}
          className="btn btn-primary"
        >
          Call me a white converter
        </button>
        <button
          onClick={() => {
            generateImagesFromLayers();
          }}
          className="btn btn-primary"
        >
          here is my number
        </button>
        {
         layers.map( (layer, index) => 
           <div className="p-5">
               <p>{index}</p>
              <img key={index} src={layer.toDataURL()} />
           </div>
         )
        }
      </div>
    </div>
  )
}

export default App
