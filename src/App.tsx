import { useState, useRef } from 'react';
import { times } from "lodash";
import { format as formatFns } from "date-fns";
import { imageToGrayScaleCanvas, generateImageFromRange, mergeImages } from "./tools";
import LayerSettings from "./Components/LayerSettings";
import Slider from "./Components/Slider";
import RangeSlider from "./Components/RangeSlider";
import { RGBArray, LayerSettingsData } from "./interfaces";
import ThreeJsRendering from "./Components/ThreeJsRendering";
import TwoDimensionRendering from "./Components/TwoDimensionRendering";
import UploadButton from "./Components/UploadButton";

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
  const [is2D, setIs2D] = useState<boolean>(false);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  function loadImage(file: File) {
    if(imageRef.current && canvasRef.current) {
      imageRef.current.src = URL.createObjectURL(file);
      imageRef.current.onload =  (event: any) => {
          setLoadedImage(true);
          imageToGrayScaleCanvas(imageRef.current!, canvasRef.current!)
      };
    }
  }

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

  async function saveImage() {
    setIsSavingImage(true)
    if(imageRef.current && anchorRef.current) {
      const dataURL = await mergeImages(layersBase64, imageRef.current.width, imageRef.current.height, "#0fff0f");
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      (anchorRef.current as any).download = `${dateString}-risography.png`;
      anchorRef.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      setIsSavingImage(false)
    }
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
      <h1>Header</h1>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <UploadButton onChange={loadImage} />
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
            <img ref={imageRef} className="hidden"/>
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
                    <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">2D</span>
            <input type="checkbox" className="toggle" checked={is2D} onChange={() => setIs2D(!is2D)} />
          </label>
        </div>
            {
            is2D ?
              <div className="flex flex-col gap-2">

                <span> Mettre un load {isSavingImage.toString()}</span>
                <a
                  className="btn btn-accent"
                  ref={anchorRef}
                  onClick={saveImage}
                >
                    Save my fucking image
                </a>
                <TwoDimensionRendering layers={layersBase64} />
              </div>
              :
              <ThreeJsRendering width={800} height={800} backgroundColor={0x1C1C1C} layers={layersBase64}/>

          }
          </div>
        </div>
      </div>
      <h1>Footer</h1>
    </div>
  )
}

export default App
