import { createContext, useContext, useReducer, Node } from 'react';
import { uniqueId } from "lodash";
import { LayerSettingsData } from "./interfaces";
import { sampleColor } from "../Components/palette";

const defaultLayers : LayerSettingsData[] = [
  { id: "Background", min: 0, max: 255, noise: 0, alpha: 255, color:"#000000", position2D: { x:0, y: 0 } },
  { id: uniqueId("Layer "), min: 0,  max: 70, noise: 10, alpha: 125, color:"#ff0059", position2D: { x:0, y: 0 } },
  { id: uniqueId("Layer "), min: 65, max:187, noise: 20, alpha: 90, color: "#168D16", position2D: { x:0, y: 0 } }
];

const LayersSettingsContext = createContext(null);
const LayersSettingsDispatchContext = createContext(null);

interface LayersSettingsProviderProps {
    children: Node;
}

export function LayersSettingsProvide({ children } : LayersSettingsProviderProps ) {
    const [layersSettings, dispatch] = useReducer(layersSettingsReducer, defaultLayers);

    return (
        <TasksContext.Provider value={layersSettings}>
          <TasksDispatchContext.Provider value={dispatch}>
            {children}
          </TasksDispatchContext.Provider>
        </TasksContext.Provider>
   );
}



export function useLayersSettings() {
  return useContext(LayersSettingsContext);
}

export function useLayersSettingsDispatch() {
  return useContext(LayersSettingsDispatchContext);
}

function createLayerSettings() {
    return {
      id: uniqueId("Layer "),
      min: 0,
      max: Math.floor(Math.random() * 255),
      noise: 10,
      alpha: 255,
      color: sampleColor(),
      position2D: { x:0, y: 0 }
    };
  }


type ActionName = 'add' | 'update' | 'delete';

type Action =
 {type: 'add' } |
 {type: 'update', layerSettingsChanges: LayerSettingsData } |
 {type: 'delete', id: string }
;

function layersSettingsReducer(layersSettings : LayerSettingsData[], action : Action) {
  switch (action.type) {
    case 'add': {
      return [...layersSettings, createLayerSettings()];
    }
    case 'update': {
      return layersSettings.map(layerSettings => {
        if(layerSettings.id === newLayerSettings.id) {
          return newLayerSettings;
        }
        return layerSettings;
      });
    }
    case 'delete': {
      return layersSettings.filter((layerSettings) => action.id !== layerSettings.id);
    }
  }
}