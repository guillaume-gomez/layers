import { createContext, useContext, useReducer, ReactElement, Dispatch } from 'react';

type ActionName = 'selected' | "unselected";

type Action =
 { type: 'selected', id: string } |
 { type: 'unselected' }
;

interface SelectedLayerReducerData {
  selectedLayer: string;
}

const SelectedLayerContext = createContext<SelectedLayerReducerData>({selectedLayer: "Background"});
const SelectedLayerDispatchContext = createContext<Dispatch<Action>>(()=> null);

export function useSelectedLayer() {
  return useContext(SelectedLayerContext);
}

export function useSelectedLayerDispatch() {
  return useContext(SelectedLayerDispatchContext);
}

interface SelectedLayerProviderProps {
    children: ReactElement;
}

export function SelectedLayerProvider({ children } : SelectedLayerProviderProps ) {
    const [selectedLayer, dispatch] = useReducer(selectedLayerReducer,{selectedLayer: "Background"});

    return (
        <SelectedLayerContext.Provider value={selectedLayer}>
          <SelectedLayerDispatchContext.Provider value={dispatch}>
            {children}
          </SelectedLayerDispatchContext.Provider>
        </SelectedLayerContext.Provider>
   );
}


function selectedLayerReducer(selectedLayer : SelectedLayerReducerData, action : Action) : SelectedLayerReducerData {
  switch (action.type) {
    case 'selected': {
      return { selectedLayer: action.id };
    }
    case 'unselected': {
      return { selectedLayer: ""}
    }
  }
}