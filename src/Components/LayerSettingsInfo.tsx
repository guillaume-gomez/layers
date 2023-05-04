import React, { useState } from 'react';

function LayerSettingsInfo() {
  return(
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-circle btn-accent">Help</label>
      <div tabIndex={0} className="dropdown-content card card-compact w-64 p-2 shadow bg-primary text-primary-content">
        <div className="card-body">
          <h3 className="card-title">Card title!</h3>
          <p>you can use any element as a dropdown.</p>
        </div>
      </div>
    </div>
  );
}

export default LayerSettingsInfo;