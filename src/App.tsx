import { useState, useRef, useEffect } from 'react';
import {  uniqueId } from "lodash";
import { useWindowSize } from "rooks";
import { imageToGrayScaleCanvas, generateImageFromRange } from "./tools";
import Slider from "./Components/Slider";
import ColorPicker from "./Components/ColorPicker";
import RangeSlider from "./Components/RangeSlider";
import { RGBArray, LayerSettingsData, QualityType } from "./interfaces";
import UploadButton from "./Components/UploadButton";
import { sampleColor } from "./Components/palette";
import ThreeJSManager from "./Components/ThreeJSManager";
import Canvas2DManager from "./Components/Canvas2DManager";
import CollapsibleCard from "./Components/CollapsibleCard";
import CollapsibleCardManager from "./Components/CollapsibleCardManager";
import LayerSettingsManager from "./Components/LayerSettingsManager";
import LayerSettingsInfo from "./Components/LayerSettingsInfo";
import Header from "./Components/Header";
import './App.css'
import { useLayersSettings, useLayersSettingsDispatch } from "./Reducers/useLayersSettings";

function App() {
  const layersSettings = useLayersSettings();
  const dispatch = useLayersSettingsDispatch();

  const [layersBase64, setLayersBase64] = useState<string[]>([]);
  const [loadedImage, setLoadedImage] = useState<boolean>(false);
  const [is2D, setIs2D] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(380);
  const [height, setHeight] = useState<number>(380 * 16/9);
  const [quality, setQuality] = useState<QualityType>("max");

  const resultDivRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const { innerWidth, innerHeight } = useWindowSize();


  useEffect(() => {
    limitSize();
  }, [innerHeight, innerWidth])


  useEffect(() => {
    generateImagesFromLayers();
  },[layersSettings, loadedImage]);

  useEffect(() => {
    if(imageRef.current && imageRef.current.width > 0 && canvasRef.current) {
      imageToGrayScaleCanvas(imageRef.current, canvasRef.current, quality);
      generateImagesFromLayers();
    }
  }, [quality])

  function limitSize() {
    const newWidth = (resultDivRef.current as any).clientWidth;
    const newHeight = (resultDivRef.current as any).clientHeight;

    const newPredefinedWidth = newWidth - 100;
    setWidth(newPredefinedWidth);
    setHeight(newPredefinedWidth * 9/16);
  }

  function loadImage(file: File) {
    setLoadedImage(false);
    if(imageRef.current && canvasRef.current) {
      imageRef.current.src = URL.createObjectURL(file);
      imageRef.current.onload =  (event: any) => {
          imageToGrayScaleCanvas(imageRef.current!, canvasRef.current!, quality);
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
    const listOfCanvasBase64  = layersSettings.map( ({min, max, noise, alpha, color}, index) => {
      return generateImageFromRange(
        canvasRef!.current!,
        {
          min,
          max,
          noise,
          color: hexToRGB(color, alpha)
        }
      );
    });
    setLayersBase64(listOfCanvasBase64);
  }

  function hexToRGB(hexColor: string, alpha: number) : RGBArray {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

    function hexToDec(hex: string) {
      return parseInt(hex, 16);
    }

    return [
      hexToDec(result![1]),
      hexToDec(result![2]),
      hexToDec(result![3]),
      alpha
    ];
  }

  return (
    <div className="flex flex-col justify-center items-center md:p-5 p-2 gap-3">
      <div className="w-4/5 hidden">
        <RangeSlider min={1} max={10000}/>
      </div>
      <Header/>
      <div className="w-full flex md:flex-row flex-col gap-3">
        <div className="settings card bg-base-200" style={{ minWidth: 325 }}>
          <div className="card-body p-2">
            <div className="card-title">Settings</div>
            <CollapsibleCardManager>
            <CollapsibleCard header="General Settings" collapse={true}>
              <select
                className="select select-bordered w-full max-w-xs"
                value={quality}
                onChange={(e) => setQuality(e.target.value as QualityType)}
              >
                <option disabled selected>Quality of result</option>
                <option value="min">Min</option>
                <option value="middle">Middle</option>
                <option value="max">Max</option>
              </select>
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
              <button className="btn btn-primary" onClick={() => dispatch({ type: 'add', newId:  uniqueId("Layer ") })}>Add a layer</button>
              <div className="flex flex-col gap-2 bg-base-300 py-3 px-2">
                <LayerSettingsManager
                  layersSettings={layersSettings}
                />
              </div>
            </CollapsibleCard>
            </CollapsibleCardManager>
          </div>
        </div>
        <div className="render card bg-base-200 w-full" ref={resultDivRef}>
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
                      width={canvasRef?.current?.width || width}
                      height={canvasRef?.current?.height || height}
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
