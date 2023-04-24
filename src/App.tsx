import { useState, useRef, useEffect } from 'react';
import { times } from "lodash";
import { imageToGrayScaleCanvas, generateImageFromRange } from "./tools";
import LayerSettings from "./Components/LayerSettings";
import Slider from "./Components/Slider";
import ColorPicker from "./Components/ColorPicker";
//import RangeSlider from "./Components/RangeSlider";
import { RGBArray, LayerSettingsData } from "./interfaces";
import UploadButton from "./Components/UploadButton";
import { sampleColor } from "./Components/palette";
import ThreeJSManager from "./Components/ThreeJSManager";
import Canvas2DManager from "./Components/Canvas2DManager";
import { SortableList } from "./Components/DND/SortableList";
import './App.css'

function createRange<T>(
  length: number,
  initializer: (index: number) => T
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}


function getMockItems() {
  return createRange(8, (index) => ({ id: index + 1 }));
}

const defaultLayers = [
  { id: "1", min: 0,  max: 70, alpha: 125, color:"#ff0059"},
  { id: "2", min: 68, max:187, alpha: 90, color: "#168D16"}
]

const testPalette : RGBArray[] =[
  [255,15,100],
  [100,15,255],
  [0,150,15],
  [11,105,180]
]

function App() {
  const [numberOfLayers, setNumberOfLayer] = useState<number>(2);
  const [layersSettings, setLayersSettings] = useState<LayerSettingsData[]>(defaultLayers);
  const [layersBase64, setLayersBase64] = useState<string[]>([]);
  const [backgroundColorLayer, setBackgroundColorLayer] = useState<string>("#000000");
  const [loadedImage, setLoadedImage] = useState<boolean>(false);
  const [is2D, setIs2D] = useState<boolean>(false);
  const [items, setItems] = useState(getMockItems);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateImagesFromLayers();
  },[numberOfLayers, layersSettings, backgroundColorLayer, loadedImage]);

  function loadImage(file: File) {
    if(imageRef.current && canvasRef.current) {
      imageRef.current.src = URL.createObjectURL(file);
      imageRef.current.onload =  (event: any) => {
          setLoadedImage(true);
          imageToGrayScaleCanvas(imageRef.current!, canvasRef.current!);
          if(resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
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
        {
          min,
          max,
          alpha,
          color: hexToRGB(color),
          backgroundColor: hexToRGB(backgroundColorLayer)
        }
      );
    });
    setLayersBase64(listOfCanvasBase64);
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
        return { id: indexLayerSettings.toString(), min, max, alpha, color};
      }
      return layerSettings;
    });
    setLayersSettings(newLayerSettings);
  }

  function createLayerSettings() {
    return { id: (layersSettings.length + 1).toString(), min: 0, max: Math.floor(Math.random() * 255), alpha: 255, color: sampleColor() };
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
          <ColorPicker label="Background color layer" value={backgroundColorLayer} onChange={(color) => setBackgroundColorLayer(color)}/>

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
            <div style={{ maxWidth: 400, margin: "30px auto" }}>
              <SortableList
                items={layersSettings}
                onChange={setLayersSettings}
                renderItem={(item) => (
                  <SortableList.Item id={item.id}>
                    {item.id}
                    <SortableList.DragHandle />
                  </SortableList.Item>
                )}
              />
            </div>
          <div className="container">
            <img ref={imageRef} className="hidden"/>
            <canvas ref={canvasRef} className="hidden" />
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">2D</span>
                <input type="checkbox" className="toggle" checked={is2D} onChange={() => setIs2D(!is2D)} />
              </label>
            </div>
            <div ref={resultRef} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="card-title">Result</div>
                  {
                  is2D ?
                      <Canvas2DManager
                        layers={layersBase64}
                        width={imageRef?.current?.width || 500}
                        height={imageRef?.current?.height || 500}
                      />
                    :
                      <ThreeJSManager
                        layers={layersBase64}
                        width={800}
                        height={800}
                      />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1>Footer</h1>
    </div>
  )
}

export default App
