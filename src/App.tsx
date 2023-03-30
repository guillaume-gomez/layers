import { useState, useRef } from 'react'
import sample from './assets/sample.png';
import { imageToGrayScaleCanvas } from "./tools";


import './App.css'

const possibleColors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFFFF"];

function App() {
  const [numberOfLayers, setNumberOfLayer] = useState<number>(2);
  const [layers, setLayers] = useState<HTMLCanvasElement[]>([]);
  const imageRef = useRef<HTMLImageElement>();
  const canvasRef = useRef<HTMLCanvasElement>();

  function generateImagesFromLayers() {

  }

  function percentageOfColors() {

  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Bonjour</h1>
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
      </div>
    </div>
  )
}

export default App
