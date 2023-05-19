import React, { useState, useMemo } from 'react';
import reverse from "lodash";
import { SortableList } from "./DND/SortableList";
import LayerSettings from "./LayerSettings";
import { LayerSettingsData } from "../interfaces";
import CollapsibleCard from "./CollapsibleCard";

interface LayerSettingsManagerProps {
  layersSettings: LayerSettingsData[];
  onChangeLayerSettings: (newLayerSettings: LayerSettingsData[]) => void;
  updateLayerSettings: (newLayerSettings : LayerSettingsData) => void;
}

function LayerSettingsManager({ layersSettings, onChangeLayerSettings, updateLayerSettings } : LayerSettingsManagerProps) {
  const [backgroundLayer, ...otherLayers] = layersSettings;

  return(
    <div className="flex flex-col gap-3">
      <LayerSettings
                key={backgroundLayer.id}
                layerSettings={backgroundLayer}
                destroyable={false}
                destroy={() => {}}
                onChange={(newLayerSettings) => updateLayerSettings(newLayerSettings)}
              />
      {
        <SortableList
          items={otherLayers}
          onChange={onChangeLayerSettings}
          renderItem={(item) => (
            <SortableList.Item id={item.id}>
              <LayerSettings
                key={item.id}
                layerSettings={item}
                destroyable={otherLayers.length > 1}
                destroy={() => {
                  const newLayerSettings = layersSettings.filter((layerSettings) => item.id !== layerSettings.id);
                  console.log(newLayerSettings);
                  onChangeLayerSettings(newLayerSettings);
                }}
                onChange={(newLayerSettings) => updateLayerSettings(newLayerSettings)}
              />
            </SortableList.Item>
          )}
        />
      }
    </div>
  );
}

export default LayerSettingsManager;