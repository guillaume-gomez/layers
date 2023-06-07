import React, { useState, useMemo } from 'react';
import reverse from "lodash";
import { SortableList } from "./DND/SortableList";
import LayerSettings from "./LayerSettings";
import { LayerSettingsData } from "../interfaces";
import CollapsibleCard from "./CollapsibleCard";
import CollapsibleCardManager from "./CollapsibleCardManager";
import { useLayersSettingsDispatch } from "../Reducers/useLayersSettings";

interface LayerSettingsManagerProps {
  layersSettings: LayerSettingsData[];
}

function LayerSettingsManager({ layersSettings } : LayerSettingsManagerProps) {
  const dispatch = useLayersSettingsDispatch();
  const [backgroundLayer, ...otherLayers] = layersSettings;
  const [openIdCollabsibleCard, setIdOpenCollabsibleCard] = useState<string>(backgroundLayer.id);

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
            onChange={(newLayerSettings) => dispatch({ type: "update", newLayerSettings })}
          />
        </CollapsibleCard>
        {
          <SortableList
            items={otherLayers}
            onChange={(otherLayers) => dispatch({ type: "sort", newLayersSettings: [backgroundLayer, ...otherLayers]}) }
            renderItem={(item) => (
              <SortableList.Item id={item.id}>
                <CollapsibleCard
                  key={item.id}
                  collapse={item.id !== openIdCollabsibleCard}
                  toggle={ () => setIdOpenCollabsibleCard(item.id) }
                  header={
                    <div className="flex flex-wrap items-center w-full justify-between">
                      <div className="flex items-center">
                        <span>{item.id}</span>
                        <div className={`w-6 h-6 rounded mx-1 my-1`} style={{background: item.color}}></div>
                      </div>
                      <button
                        className="btn btn-circle btn-outline-error btn-sm"
                        onClick={() =>{ dispatch({ type: "delete", id: item.id }) }}
                        disabled={otherLayers.length === 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  }
                >
                  <LayerSettings
                    key={item.id}
                    layerSettings={item}
                    onChange={(newLayerSettings) => dispatch({ type: "update", newLayerSettings })}
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