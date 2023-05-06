import React, { useState } from 'react';
import { SortableList } from "./DND/SortableList";
import LayerSettings from "./LayerSettings";
import { LayerSettingsData } from "../interfaces";

interface LayerSettingsManagerProps {
  layersSettings: LayerSettingsData[];
  onChangeLayerSettings: (newLayerSettings: LayerSettingsData[]) => void;
  updateLayerSettings: (newLayerSettings : LayerSettingsData) => void;
}

function LayerSettingsManager({ layersSettings, onChangeLayerSettings, updateLayerSettings } : LayerSettingsManagerProps) {
  const [idLayerSettingsOpen, setIdLayerSettingsOpen] = useState<string>(layersSettings[0].id);
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
                open={idLayerSettingsOpen === item.id}
                toggle={() => setIdLayerSettingsOpen(item.id) }
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