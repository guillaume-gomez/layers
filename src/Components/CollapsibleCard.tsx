import React, { useState } from 'react';

interface CollapsibleCardProps {
  onClick?: () => void;
  forceCollapsible?: boolean;
  header: React.ReactNode;
  children: React.ReactNode
}

function CollapsibleCard({ onClick, header, forceCollapsible = false, children } : CollapsibleCardProps): React.ReactElement {

  if(forceCollapsible) {
    return (
      <div className="card border border-base-300 bg-base-100 rounded-box">
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


