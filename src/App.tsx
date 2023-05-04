import { useState, useRef, useEffect } from 'react';
import { times } from "lodash";
import { useOnWindowResize } from "rooks";
import { imageToGrayScaleCanvas, generateImageFromRange } from "./tools";
import LayerSettings from "./Components/LayerSettings";
import Slider from "./Components/Slider";
import ColorPicker from "./Components/ColorPicker";
import RangeSlider from "./Components/RangeSlider";
import { RGBArray, LayerSettingsData } from "./interfaces";
import UploadButton from "./Components/UploadButton";
import { sampleColor } from "./Components/palette";
import ThreeJSManager from "./Components/ThreeJSManager";
import Canvas2DManager from "./Components/Canvas2DManager";
import { SortableList } from "./Components/DND/SortableList";
//import LayerSettingsInfo from "./Components/LayerSettingsInfo";
import './App.css'

const defaultLayers = [
  { id: "1", min: 0,  max: 70, alpha: 125, color:"#ff0059", position2D: { x:0, y: 0 } },
  { id: "2", min: 68, max:187, alpha: 90, color: "#168D16", position2D: { x:0, y: 0 } }
]

function App() {
  const [numberOfLayers, setNumberOfLayer] = useState<number>(2);
  const [layersSettings, setLayersSettings] = useState<LayerSettingsData[]>(defaultLayers);
  const [layersBase64, setLayersBase64] = useState<string[]>([]);
  const [backgroundColorLayer, setBackgroundColorLayer] = useState<string>("#000000");
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
  },[numberOfLayers, layersSettings, backgroundColorLayer, loadedImage]);

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
    const listOfCanvasBase64  = layersSettings.map( ({min, max, alpha, color}, index) => {
      return generateImageFromRange(
        canvasRef!.current!,
        {
          min,
          max,
          alpha,
          color: hexToRGB(color),
          backgroundColor: hexToRGB(backgroundColorLayer),
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

  function updateLayerSettings(newLayerSettings : LayerSettingsData) {
    const newLayersSettings : LayerSettingsData[] = layersSettings.map(layerSettings => {
      if(layerSettings.id === newLayerSettings.id) {
        return newLayerSettings;
      }
      return layerSettings;
    });
    setLayersSettings(newLayersSettings);
  }

  function createLayerSettings() {
    return {
      id: (layersSettings.length + 1).toString(),
      min: 0,
      max: Math.floor(Math.random() * 255),
      alpha: 255,
      color: sampleColor(),
      position2D: { x:0, y: 0 }
    };
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
      <div className="container flex xl:flex-row flex-col bg-base-200 p-2 gap-3">
        <div className="settings card bg-base-300">
          <div className="card-body">
            <div className="card-title">Settings</div>
            <RangeSlider min={1} max={10000}/>
            <UploadButton onChange={loadImage} />
            <Slider
              label="Number of layer"
              onChange={(value) => updateNumberOfLayer(value)}
              value={numberOfLayers}
              min={2}
              max={12}
            />
            <ColorPicker label="Background color layer" value={backgroundColorLayer} onChange={(color) => setBackgroundColorLayer(color)}/>
            <div className="card bg-accent">
              <div className="card-title flex flex-row justify-between">

                LayerSettings
                {/*<LayerSettingsInfo />*/}
              </div>
              <div className="flex flex-col gap-3">
                {
                  <SortableList
                    items={layersSettings}
                    onChange={setLayersSettings}
                    renderItem={(item) => (
                      <SortableList.Item id={item.id}>
                        <LayerSettings
                          key={item.id}
                          layerSettings={item}
                          onChange={(newLayerSettings) => updateLayerSettings(newLayerSettings)}
                        />
                      </SortableList.Item>
                    )}
                  />
                }
              </div>
            </div>
          </div>
        </div>
        <div className="render card bg-base-300 basis-10/12" ref={resultDivRef}>
          <div className="card-body">
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
