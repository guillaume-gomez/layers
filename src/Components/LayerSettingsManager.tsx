import React, { useState } from 'react';
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
  return(
    <div className="flex flex-col gap-3">
      {
        <SortableList
          items={layersSettings}
          onChange={onChangeLayerSettings}
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
  );
}

export default LayerSettingsManager;