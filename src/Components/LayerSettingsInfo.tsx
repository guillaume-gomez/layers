import React, { useState } from 'react';
import videoSample from '/video_sample.webm';
import { useLayersSettingsDispatch } from "../Reducers/useLayersSettings";

function LayerSettingsInfo() {
  const dispatch = useLayersSettingsDispatch();

  function setDefaultSettings() {
    dispatch({type: "own-settings"});
  }

  return(
    <>
      <label htmlFor="modal-help" className="btn btn-sm btn-info btn-outline text-xs">Help ?</label>
      <input type="checkbox" id="modal-help" className="modal-toggle" />
      <label htmlFor="modal-help" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">See here what you could do here</h3>
          <div className="flex flex-col gap-2">
            <video controls width="600">
                  <source src={videoSample} type="video/webm" />
              </video>
              OR
              <label
                className="link link-accent text-lg"
                onClick={setDefaultSettings}
                htmlFor="modal-help"
              >
                Click here to run default settings
              </label>
          </div>
        </label>
      </label>
    </>
  );
}

export default LayerSettingsInfo;