import { useState } from 'react'
import Slider from "./Slider";
import ColorPicker from "./ColorPicker";
import { LayerSettingsData } from "../interfaces";


interface LayerSettingsInterface {
  onChange: (min: number, max: number, alpha: number, color: string) => void;
  layerSettings: LayerSettingsData;
}

function LayerSettings({ onChange, layerSettings } : LayerSettingsInterface) {

  function handleChangeMin(value: number) {
    onChange(value, layerSettings.max, layerSettings.alpha, layerSettings.color);
  }

  function handleChangeMax(value: number) {
    onChange(layerSettings.min, value, layerSettings.alpha, layerSettings.color);
  }

  function handleChangeAlpha(value: number) {
    onChange(layerSettings.min, layerSettings.max, value, layerSettings.color);
  }

  function handleChangeColor(value: string) {
    onChange(layerSettings.min, layerSettings.max, layerSettings.alpha ,value);
  }

  return (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title">Layer Settings</h2>
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
      </div>
    </div>
  </div>
  )
}

export default LayerSettings;
