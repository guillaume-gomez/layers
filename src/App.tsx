import { useState, useRef, useEffect } from 'react';
import { times, uniqueId } from "lodash";
import { useOnWindowResize } from "rooks";
import { imageToGrayScaleCanvas, generateImageFromRange } from "./tools";
import Slider from "./Components/Slider";
import ColorPicker from "./Components/ColorPicker";
import RangeSlider from "./Components/RangeSlider";
import { RGBArray, LayerSettingsData } from "./interfaces";
import UploadButton from "./Components/UploadButton";
import { sampleColor } from "./Components/palette";
import ThreeJSManager from "./Components/ThreeJSManager";
import Canvas2DManager from "./Components/Canvas2DManager";
import CollapsibleCard from "./Components/CollapsibleCard";
import CollapsibleCardManager from "./Components/CollapsibleCardManager";
import LayerSettingsManager from "./Components/LayerSettingsManager";
import LayerSettingsInfo from "./Components/LayerSettingsInfo";
import './App.css'

const defaultLayers = [
  { id: "Background", min: 0, max: 255, noise: 0, color:"#000000FF", position2D: { x:0, y: 0 } },
  { id: uniqueId("Layer "), min: 0,  max: 70, noise: 10, color:"#ff005988", position2D: { x:0, y: 0 } },
  { id: uniqueId("Layer "), min: 65, max:187, noise: 20, color: "#168D16DD", position2D: { x:0, y: 0 } }
]

function App() {
  const [layersSettings, setLayersSettings] = useState<LayerSettingsData[]>(defaultLayers);
  const [layersBase64, setLayersBase64] = useState<string[]>([]);
  const [loadedImage, setLoadedImage] = useState<boolean>(false);
  const [is2D, setIs2D] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(380);
  const [height, setHeight] = useState<number>(380 * 16/9);

  const resultDivRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    limitSize();
  }, [])

  useOnWindowResize(() => {
    limitSize();
  });

  useEffect(() => {
    generateImagesFromLayers();
  },[layersSettings, loadedImage]);

  function limitSize() {
    const newWidth = (resultDivRef.current as any).clientWidth;
    const newHeight = (resultDivRef.current as any).clientHeight;

    const newPredefinedWidth = newWidth - 50;
    setWidth(newPredefinedWidth);
    setHeight(newPredefinedWidth * 9/16);

  }

  function loadImage(file: File) {
    if(imageRef.current && canvasRef.current) {
      imageRef.current.src = URL.createObjectURL(file);
      imageRef.current.onload =  (event: any) => {
          imageToGrayScaleCanvas(imageRef.current!, canvasRef.current!);
          setLoadedImage(true);
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
    const listOfCanvasBase64  = layersSettings.map( ({min, max, noise, color}, index) => {
      return generateImageFromRange(
        canvasRef!.current!,
        {
          min,
          max,
          noise,
          color: hexToRGBA(color)
        }
      );
    });
    setLayersBase64(listOfCanvasBase64);
  }

  function hexToRGBA(hexColor: string) : RGBArray {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    //const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

    function hexToDec(hex: string) {
      return parseInt(hex, 16);
    }
    console.log(hexColor);
    console.log("result -> ", result);

    return [
      hexToDec(result![1]),
      hexToDec(result![2]),
      hexToDec(result![3]),
      hexToDec(result![4])
    ];
  }

  function updateLayerSettings(newLayerSettings : LayerSettingsData) {
    const newLayersSettings : LayerSettingsData[] = layersSettings.map(layerSettings => {
      if(layerSettings.id === newLayerSettings.id) {
        return newLayerSettings;
      }
      return layerSettings;
    });
    setLayersSettings(newLayersSettings);
  }

  function addNewLayerSettings() {
    const newLayersSettings = [...layersSettings, createLayerSettings()];
    setLayersSettings(newLayersSettings);
  }

  function createLayerSettings() {
    return {
      id: uniqueId("Layer "),
      min: 0,
      max: Math.floor(Math.random() * 255),
      noise: 10,
      color: `${sampleColor()}AA`,
      position2D: { x:0, y: 0 }
    };
  }

  function onChangeLayerSettings(newLayersSettings : LayerSettingsData[]) {
    setLayersSettings(newLayersSettings);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Header</h1>
      <div className="w-4/5 hidden">
        <RangeSlider min={1} max={10000}/>
      </div>
      <div className="container flex xl:flex-row flex-col gap-3">
        <div className="settings card bg-base-200">
          <div className="card-body p-2">
            <div className="card-title">Settings</div>
            <CollapsibleCardManager>
            <CollapsibleCard header="General Settings" collapse={true}>
              <UploadButton onChange={loadImage} />
            </CollapsibleCard>
            <CollapsibleCard
              header={
                <div className="flex items-center gap-2">
                  <span>Layers settings</span>
                  <LayerSettingsInfo />
                </div>
              }
            >
              <p>{`Number of layers : ${layersSettings.length}`}</p>
              <button className="btn btn-primary" onClick={addNewLayerSettings}>Add a layer</button>
              <div className="flex flex-col gap-2 bg-base-300 py-3 px-2">
                <LayerSettingsManager
                  onChangeLayerSettings={onChangeLayerSettings}
                  layersSettings={layersSettings}
                  updateLayerSettings={updateLayerSettings}
                />
              </div>
            </CollapsibleCard>
            </CollapsibleCardManager>
          </div>
        </div>
        <div className="render card bg-base-200 basis-10/12" ref={resultDivRef}>
          <div className="card-body p-2">
            <div className="card-title">Renderer</div>
            <img ref={imageRef} className="hidden"/>
            <canvas ref={canvasRef} className="hidden" />
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">2D</span>
                <input type="checkbox" className="toggle" checked={is2D} onChange={() => setIs2D(!is2D)} />
              </label>
            </div>
            <div ref={resultRef}>
              {
                is2D ?
                    <Canvas2DManager
                      layers={layersBase64}
                      width={imageRef?.current?.width || width}
                      height={imageRef?.current?.height || height}
                    />
                  :
                    <ThreeJSManager
                      layers={layersBase64}
                      positions2d={layersSettings.map(layerSetting => layerSetting.position2D)}
                      width={width}
                      height={height}
                    />
              }
            </div>
          </div>
        </div>
      </div>
      <h1>Footer</h1>
    </div>
  )
}

export default App
