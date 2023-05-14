import { useState } from 'react'
import Slider from "./Slider";
import ColorPicker from "./ColorPicker";
import { LayerSettingsData } from "../interfaces";


interface LayerSettingsInterface {
  onChange: (newLayerSettings: LayerSettingsData) => void;
  layerSettings: LayerSettingsData;
}

function LayerSettings({ onChange, layerSettings } : LayerSettingsInterface) {

  function handleChangeMin(value: number) {
    onChange({ ...layerSettings, min: value });
  }

  function handleChangeMax(value: number) {
    onChange({ ...layerSettings, max: value });
  }

  function handleChangeAlpha(value: number) {
    onChange({ ...layerSettings, alpha: value });
  }

  function handleChangeColor(value: string) {
    onChange({ ...layerSettings, color: value });
  }


  function handleChangeX(value: number) {
    onChange({ ...layerSettings, position2D:{ ...layerSettings.position2D, x: value } });
  }


  function handleChangeY(value: number) {
    onChange({ ...layerSettings, position2D:{ ...layerSettings.position2D, y: value }});
  }

  return (
  <div className="card bg-base-100 shadow-xl">
    <div className="">
      <div className="flex flex-col gap-3">
        <Slider
          label="Min"
          onChange={(value) => handleChangeMin(value)}
          value={layerSettings.min}
          min={0}
          max={255}
        />
        <Slider
          label="Max"
          onChange={(value) => handleChangeMax(value)}
          value={layerSettings.max}
          min={0}
          max={255}
        />
        <ColorPicker label="Color" value={layerSettings.color} onChange={(color) => handleChangeColor(color)}/>
        <Slider
          label="Alpha"
          onChange={(value) => handleChangeAlpha(value)}
          value={layerSettings.alpha}
          min={0}
          max={255}
        />
        <Slider
          label="position X"
          onChange={(value) => handleChangeX(value)}
          value={layerSettings.position2D.x}
          min={-1}
          max={1}
          float
          step={0.001}
        />
        <Slider
          label="position Y"
          onChange={(value) => handleChangeY(value)}
          value={layerSettings.position2D.y}
          min={-1}
          max={1}
          float
          step={0.001}
        />
      </div>
    </div>
  </div>
  )
}

export default LayerSettings;
