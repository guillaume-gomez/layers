import { createContext, useContext, useReducer, ReactElement, Dispatch } from 'react';
import { uniqueId } from "lodash";
import { LayerSettingsData } from "../interfaces";
import { sampleColor } from "../Components/palette";

const defaultLayers : LayerSettingsData[] = [
  { id: "Background", min: 0, max: 255, noise: 0, alpha: 255, color:"#000000", position2D: { x:0, y: 0 }, needUpdate: true },
  { id: uniqueId("Layer "), min: 0,  max: 70, noise: 10, alpha: 125, color:"#ff0059", position2D: { x:0, y: 0 }, needUpdate: true },
  { id: uniqueId("Layer "), min: 65, max:187, noise: 20, alpha: 150, color: "#168D16", position2D: { x:0, y: 0 }, needUpdate: true }
];

type ActionName = 'add' | 'update' | 'delete' | 'clear-cache' | 'force-update';

type Action =
 { type: 'add', newId: string } |
 { type: 'update', newLayerSettings: LayerSettingsData } |
 { type: 'delete', id: string } |
 { type: 'sort', newLayersSettings: LayerSettingsData[] } |
 { type: 'clear-cache' } |
 { type: 'force-update'}
;

const LayersSettingsContext = createContext<LayerSettingsData[]>([]);
const LayersSettingsDispatchContext = createContext<Dispatch<Action>>(()=> null);

export function useLayersSettings() {
  return useContext(LayersSettingsContext);
}

export function useLayersSettingsDispatch() {
  return useContext(LayersSettingsDispatchContext);
}

interface LayersSettingsProviderProps {
    children: ReactElement;
}

export function LayersSettingsProvider({ children } : LayersSettingsProviderProps ) {
    const [layersSettings, dispatch] = useReducer(layersSettingsReducer, defaultLayers);

    return (
        <LayersSettingsContext.Provider value={layersSettings}>
          <LayersSettingsDispatchContext.Provider value={dispatch}>
            {children}
          </LayersSettingsDispatchContext.Provider>
        </LayersSettingsContext.Provider>
   );
}

function createLayerSettings(id: string) {
   return {
      id,
      min: 0,
      max: Math.floor(Math.random() * 255),
      noise: 10,
      alpha: 255,
      color: sampleColor(),
      position2D: { x:0, y: 0 },
      needUpdate: true
    };
  }


function layersSettingsReducer(layersSettings : LayerSettingsData[], action : Action) : LayerSettingsData[] {
  switch (action.type) {
    case 'add': {
      const result = [...layersSettings, createLayerSettings(action.newId)];
      return result;
    }
    case 'update': {
      const { newLayerSettings } = action;
      return layersSettings.map(layerSettings => {
        if(layerSettings.id === newLayerSettings.id) {
          return { ...newLayerSettings, needUpdate: true };
        }
        return layerSettings;
      });
    }
    case 'sort': {
      return action.newLayersSettings;
    }
    case 'delete': {
      const remaininglayersSettings = layersSettings.filter((layerSettings) => action.id !== layerSettings.id);
      return remaininglayersSettings.map((layerSettings) => ({ ...layerSettings, needUpdate: true }));
    }
    case 'clear-cache': {
      return layersSettings.map(layerSettings => ({...layerSettings, needUpdate: false }));
    }
    case 'force-update': {
      return layersSettings.map(layerSettings => ({...layerSettings, needUpdate: true }));
    }
  }
}