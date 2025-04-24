import { useState, useRef, useEffect } from 'react';
import {  uniqueId } from "lodash";
import { useWindowSize } from "rooks";
import { imageToGrayScaleCanvas, generateImageFromRange } from "../tools";
import Slider from "./Slider";
import ColorPicker from "./ColorPicker";
import { RGBArray, LayerSettingsData, QualityType, LayersBase64Data } from "../interfaces";
import UploadButton from "./UploadButton";
import { sampleColor } from "./palette";
import { hexToRGB } from "../colorConverterTools";
import ThreeJSManager from "./ThreeJSManager";
import Canvas2DManager from "./Canvas2DManager";
import CollapsibleCard from "./CollapsibleCard";
import CollapsibleCardManager from "./CollapsibleCardManager";
import LayerSettingsManager from "./LayerSettingsManager";
import LayerSettingsInfo from "./LayerSettingsInfo";
import { SelectedLayerProvider } from "../Reducers/useSelectedLayersSettings";
import { useLayersSettings, useLayersSettingsDispatch } from "../Reducers/useLayersSettings";


function MainContent() {
  const layersSettings = useLayersSettings();
  const dispatch = useLayersSettingsDispatch();
  const [layersBase64, setLayersBase64] = useState<LayersBase64Data[]>([]);
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
    dispatch({type: "force-update"});
  }, [loadedImage]);

  useEffect(() => {
    if(layersSettings.find(layerSettings => layerSettings.needUpdate === true)) {
      generateImagesFromLayers();
    }
  },[layersSettings]);

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

    const listOfCanvasBase64 : LayersBase64Data[] = layersSettings.map( (layerSettings, index) => {
      if(layerSettings.needUpdate) {
        const { id, min, max, noise, color, alpha} = layerSettings

        const layerBase64 = generateImageFromRange(
          canvasRef!.current!,
          {
            min,
            max,
            noise,
            color: hexToRGB(color, alpha)
          }
        );

        return { id, layerBase64 }
      } else {
        return layersBase64[index];
      }
    });

    setLayersBase64(listOfCanvasBase64);
    dispatch({type: 'clear-cache'})
  }

  return (
    <SelectedLayerProvider>
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
                <option disabled>Quality of result</option>
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
              <button
                disabled={layersSettings.length >= 20}
                className="btn btn-primary"
                onClick={() => dispatch({ type: 'add', newId:  uniqueId("Layer ") })}
              >
                Add a layer
              </button>
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
    </SelectedLayerProvider>
  )
}

export default MainContent;
