import { useState, useRef, useEffect } from 'react';
import { times } from "lodash";
import sample from './assets/sample.png';
import { imageToGrayScaleCanvas, generateImageFromRange } from "./tools";
import LayerSettings from "./Components/LayerSettings";
import Slider from "./Components/Slider";


import './App.css'

const possibleColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF", "#000000"];

type RGBArray = [number, number, number];
interface LayerSettingsData {
  min: number;
  max: number;
  color: string;
}

const testPalette : RGBArray[] =[
  [255,15,100],
  [100,15,255],
  [0,150,15],
  [11,105,180]
]

function App() {
  const [numberOfLayers, setNumberOfLayer] = useState<number>(0);
  const [layersSettings, setLayersSettings] = useState<LayerSettingsData[]>([]);
  const [layers, setLayers] = useState<HTMLCanvasElement[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function generateImagesFromLayers() {
    if(!canvasRef.current) {
      return;
    }

    const listOfCanvas : HTMLCanvasElement[] = layersSettings.map( ({min, max, color}, index) => {
      return generateImageFromRange(
        canvasRef!.current!,
        min,
        max,
        hexToRGB(color)
      );
    });
    setLayers(listOfCanvas);
  }

  function percentageOfColors() {
  }


  function hexToRGB(hexColor: string) : RGBArray {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

    function hexToDec(hex: string) {
      return parseInt(hex, 16);
    }

    return [
      hexToDec(result![1]),
      hexToDec(result![2]),
      hexToDec(result![3]),
    ];
  }

  function updateLayerSettings(index: number, min: number, max: number, color: string) {
    const newLayerSettings : LayerSettingsData[] = layersSettings.map((layerSettings, indexLayerSettings) => {
      if(indexLayerSettings === index) {
        return { min, max, color};
      }
      return layerSettings;
    });
    setLayersSettings(newLayerSettings);
  }

  function createLayerSettings() {
    return { min: 0, max: 0, color: "#00FF00" };
  }

  function updateNumberOfLayer(numberOfLayer: number) {
     setNumberOfLayer(numberOfLayer);

     if(layersSettings.length === numberOfLayer) {
      return;
     }

     const diff = Math.abs(layersSettings.length - numberOfLayer);
     if(layersSettings.length < numberOfLayer) {
        const newElements = times(diff, createLayerSettings);
        setLayersSettings([...layersSettings, ...newElements]);
     }

     if(layersSettings.length > numberOfLayer) {
        setLayersSettings(layersSettings.slice(0,-diff));
     }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Bonjour</h1>
      <Slider
        label="Number of layer"
        onChange={(value) => updateNumberOfLayer(value)}
        value={numberOfLayers
        }
        min={2}
        max={12}
      />

      <div className="flex flex-col gap-3">
      {
        layersSettings.map( (layerSettings, index) => (
          <LayerSettings
            layerSettings={layerSettings}
            onChange={(min, max, color) => updateLayerSettings(index, min, max, color)}
          />
          )
        )
      }
      </div>
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
        <div className="relative">
        {
         layers.map( (layer, index) => 
          <img className="absolute" key={index} src={layer.toDataURL()} />
         )
        }
        </div>
      </div>
    </div>
  )
}

export default App
