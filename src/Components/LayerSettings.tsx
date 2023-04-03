import { useState } from 'react'
import Slider from "./Slider";

interface LayerSettingsData {
  min: number;
  max: number;
  color: string;
}


interface LayerSettingsInterface {
  onChange: (min: number, max: number, color: string) => void;
  layerSettings: LayerSettingsData;
}

function LayerSettings({ onChange, layerSettings } : LayerSettingsInterface) {

  function handleChangeMin(value: number) {
    onChange(value, layerSettings.max, layerSettings.color);
  }

  function handleChangeMax(value: number) {
    onChange(layerSettings.min, value, layerSettings.color);
  }

  function handleChangeColor(value: string) {
    onChange(layerSettings.min, layerSettings.max, value);
  }

  return (
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
      <input type="color" onChange={(e) => handleChangeColor(e.target.value)} value={layerSettings.color} />
    </div>
  )
}

export default LayerSettings;
