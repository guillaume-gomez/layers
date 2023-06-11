import React from 'react';

import { LayersSettingsProvider } from "./Reducers/useLayersSettings";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import RangeSlider from "./Components/RangeSlider";
import MainContent from "./Components/MainContent";
import './App.css'

function App() {
  return (
    <div className="flex flex-col justify-center items-center md:p-5 p-2 gap-3">
      <div className="w-4/5 hidden">
        <RangeSlider min={1} max={10000}/>
      </div>
      <Header/>
      <LayersSettingsProvider>
        <MainContent />
      </LayersSettingsProvider>
      <Footer />
    </div>
  )
}

export default App
