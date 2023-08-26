import React, { useState } from 'react';
import videoSample from '/video_sample.webm';
import { useLayersSettingsDispatch } from "../Reducers/useLayersSettings";

function LayerSettingsInfo() {
  const dispatch = useLayersSettingsDispatch();

  function setDefaultSettings() {
    dispatch({type: "own-settings"});
  }

  return(
    <div className="dropdown dropdown-hover">
      <label tabIndex={0} className="btn btn-sm btn-info btn-outline text-xs">Help ?</label>
      <div tabIndex={0} className="dropdown-content card card-compact w-96 p-2 shadow bg-neutral text-primary-content">
        <div className="card-body">
          <h3 className="card-title">See here what you could do here</h3>
          <video controls width="600">
              <source src={videoSample} type="video/webm" />
          </video>
          OR
          <a className="link link-accent text-lg" onClick={setDefaultSettings}>Click here to run default settings</a>
        </div>
      </div>
    </div>
  );
}

export default LayerSettingsInfo;