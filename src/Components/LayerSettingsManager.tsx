import React, { useState, useMemo } from 'react';
import reverse from "lodash";
import { SortableList } from "./DND/SortableList";
import LayerSettings from "./LayerSettings";
import { LayerSettingsData } from "../interfaces";
import CollapsibleCard from "./CollapsibleCard";
import CollapsibleCardManager from "./CollapsibleCardManager";

interface LayerSettingsManagerProps {
  layersSettings: LayerSettingsData[];
  onChangeLayerSettings: (newLayerSettings: LayerSettingsData[]) => void;
  updateLayerSettings: (newLayerSettings : LayerSettingsData) => void;
}

// due to props drilling collapsiblecardManager is not relevant here
function LayerSettingsManager({ layersSettings, onChangeLayerSettings, updateLayerSettings } : LayerSettingsManagerProps) {
  const [backgroundLayer, ...otherLayers] = layersSettings;
  const [openIdCollabsibleCard, setIdOpenCollabsibleCard] = useState<string>(backgroundLayer.id);

  function destroyLayer(layerSettingId: string) {
    const newLayerSettings = layersSettings.filter((layerSettings) => layerSettingId !== layerSettings.id);
    onChangeLayerSettings(newLayerSettings);
  }

  return(
    <div className="flex flex-col gap-3">
        <CollapsibleCard
          key={backgroundLayer.id}
          collapse={backgroundLayer.id !== openIdCollabsibleCard}
          toggle={() => setIdOpenCollabsibleCard(backgroundLayer.id) }
          header={
            <div className="flex flex-wrap items-center w-full justify-between">
              <span>{backgroundLayer.id}</span>
              <button className="btn btn-circle btn-outline-error btn-sm" disabled={true}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          }
        >
          <LayerSettings
            key={backgroundLayer.id}
            layerSettings={backgroundLayer}
            onChange={(newLayerSettings) => updateLayerSettings(newLayerSettings)}
          />
        </CollapsibleCard>
        {
          <SortableList
            items={otherLayers}
            onChange={(otherLayers) => onChangeLayerSettings([backgroundLayer, ...otherLayers])}
            renderItem={(item) => (
              <SortableList.Item id={item.id}>
                <CollapsibleCard
                  key={item.id}
                  collapse={item.id !== openIdCollabsibleCard}
                  toggle={ () => setIdOpenCollabsibleCard(item.id) }
                  header={
                    <div className="flex flex-wrap items-center w-full justify-between">
                      <span>{item.id}</span>
                      <button className="btn btn-circle btn-outline-error btn-sm" onClick={() =>{destroyLayer(item.id)}} disabled={otherLayers.length === 1}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  }
                >
                  <LayerSettings
                    key={item.id}
                    layerSettings={item}
                    onChange={(newLayerSettings) => updateLayerSettings(newLayerSettings)}
                  />
                </CollapsibleCard>
              </SortableList.Item>
            )}
          />
        }
    </div>
  );
}

export default LayerSettingsManager;