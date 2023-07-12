import React, { useState } from 'react';
import videoSample from '/video_sample.webm';

function LayerSettingsInfo() {
  return(
    <div className="dropdown dropdown-hover">
      <label tabIndex={0} className="btn btn-sm btn-primary btn-outline text-xs">Help ?</label>
      <div tabIndex={0} className="dropdown-content card card-compact w-96 p-2 shadow bg-primary text-primary-content">
        <div className="card-body">
          <h3 className="card-title">See here what you could do here</h3>
          <video controls width="600">
              <source src={videoSample} type="video/webm" />
          </video>
        </div>
      </div>
    </div>
  );
}

export default LayerSettingsInfo;