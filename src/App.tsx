import { useState, useRef, useEffect } from 'react';
import { times } from "lodash";
import sample from './assets/sample.png';
import { imageToGrayScaleCanvas, generateImageFromRange } from "./tools";
import LayerSettings from "./Components/LayerSettings";
import Slider from "./Components/Slider";
import ColorPicker from "./Components/ColorPicker";
import { RGBArray, LayerSettingsData } from "./interfaces";


import './App.css'

const possibleColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF", "#000000"];



const testLayerSettings = [
  {min: 0,  max: 70, alpha: 70, color:"#ff0059"},
  {min: 68, max:187, alpha: 10, color: "#168D16"}
]

const testPalette : RGBArray[] =[
  [255,15,100],
  [100,15,255],
  [0,150,15],
  [11,105,180]
]

function App() {
  const [numberOfLayers, setNumberOfLayer] = useState<number>(2);
  const [layersSettings, setLayersSettings] = useState<LayerSettingsData[]>(testLayerSettings);
  const [layersBase64, setLayersBase64] = useState<string[]>([]);
  const [loadedImage, setLoadedImage] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    if(imageRef.current) {
      imageRef.current.onload = () => {
        if(canvasRef.current) {
          setLoadedImage(true);
          imageToGrayScaleCanvas(imageRef.current!, canvasRef.current)
        }
      }

    }
  }, [imageRef])

  function generateImagesFromLayers() {
    if(!canvasRef.current) {
      return;
    }

    const listOfCanvasBase64  = layersSettings.map( ({min, max, alpha, color}, index) => {
      return generateImageFromRange(
        canvasRef!.current!,
        min,
        max,
        alpha,
        hexToRGB(color)
      );
    });
    setLayersBase64(listOfCanvasBase64);
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

  function updateLayerSettings(index: number, min: number, max: number, alpha: number, color: string) {
    const newLayerSettings : LayerSettingsData[] = layersSettings.map((layerSettings, indexLayerSettings) => {
      if(indexLayerSettings === index) {
        return { min, max, alpha, color};
      }
      return layerSettings;
    });
    setLayersSettings(newLayerSettings);
  }

  function createLayerSettings() {
    return { min: 0, max: 0, alpha: 255, color: "#00FF00" };
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
      <ColorPicker label="my color" onChange={(color) => console.log(color)}/>
      <Slider
        label="Number of layer"
        onChange={(value) => updateNumberOfLayer(value)}
        value={numberOfLayers}
        min={2}
        max={12}
      />

      <div className="flex flex-col gap-3">
      {
        layersSettings.map( (layerSettings, index) => (
          <LayerSettings
            key={index}
            layerSettings={layerSettings}
            onChange={(min, max, alpha, color) => updateLayerSettings(index, min, max, alpha, color)}
          />
          )
        )
      }
      </div>
      <div className="container">
        <img ref={imageRef} src={sample}  className="hidden"/>
        <canvas ref={canvasRef} className="hidden" />
        <button
          disabled={!loadedImage}
          onClick={() => {
           generateImagesFromLayers();
          }}
          className="btn btn-primary"
        >
          here is my number
        </button>
        <div className="relative">
        {
         layersBase64.map( (layerBase64, index) =>
          <img className="absolute" key={index} src={layerBase64} />
         )
        }
        </div>
      </div>
    </div>
  )
}

export default App
