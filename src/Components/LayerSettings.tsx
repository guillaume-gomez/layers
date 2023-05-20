import { useState } from 'react'
import Slider from "./Slider";
import ColorPicker from "./ColorPicker";
import CollapsibleCard from "./CollapsibleCard";
import { LayerSettingsData } from "../interfaces";


interface LayerSettingsInterface {
  onChange: (newLayerSettings: LayerSettingsData) => void;
  destroy: () => void;
  destroyable: boolean;
  layerSettings: LayerSettingsData;
}

function LayerSettings({ onChange, layerSettings,destroy, destroyable } : LayerSettingsInterface) {

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
    <CollapsibleCard
      header={
        <div className="flex flex-wrap items-center w-full justify-between">
          <span>{layerSettings.id}</span>
          <button className="btn btn-circle btn-outline-error btn-sm" onClick={destroy} disabled={!destroyable}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      }
    >
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
    </CollapsibleCard>
  )
}

export default LayerSettings;
