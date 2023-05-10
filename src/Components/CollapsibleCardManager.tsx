import React, { useState, Children } from 'react';
import { SortableList } from "./DND/SortableList";
import LayerSettings from "./LayerSettings";
import { LayerSettingsData } from "../interfaces";

interface CollapsibleCardManagerProps {
  children: React.ReactNode;
}

function CollapsibleCardManager({ children } : CollapsibleCardManagerProps) {
  const [openIndexCollabsibleCard, setIndexOpenCollabsibleCard] = useState<number>(0);

  return (
    <div>
      {
        React.Children.map(children, (child, index) => {
          if(index === openIndexCollabsibleCard) {
            return React.cloneElement(child as any, {
                collapse: false,
                toggle: () => setIndexOpenCollabsibleCard(index)
              })
          }

          return React.cloneElement(child as any, {
            collapse: true,
            toggle: () => setIndexOpenCollabsibleCard(index)
          });
        })
      }
    </div>
  );
}

export default CollapsibleCardManager;