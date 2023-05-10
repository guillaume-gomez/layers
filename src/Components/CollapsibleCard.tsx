import React, { useState } from 'react';

interface CollapsibleCardProps {
  toggle?: () => void;
  collapse?: boolean;
  header: React.ReactNode;
  children: React.ReactNode
}

function CollapsibleCard({  toggle, collapse = false, header, children } : CollapsibleCardProps): React.ReactElement {

  if(collapse) {
    return (
      <div className="card border border-base-300 bg-base-100 rounded-box" onClick={toggle}>
        <div className="card-body p-2">
          <div className="card-title text-xl font-medium">
            {header}
          </div>
        </div>
      </div>
      );
  }

  return (
    <div className="card border border-base-300 bg-base-100 rounded-box">
      <div className="card-body p-2">
        <div className="card-title text-xl font-medium">
            {header}
        </div>
        {children}
      </div>
    </div>
  );
}

export default CollapsibleCard;


