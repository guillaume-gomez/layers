import { useState } from 'react'
import sample from './assets/sample.png'

import './App.css'

const possibleColors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFFFF"];

function App() {
  const [numberOfLayers, setNumberOfLayer] = useState<number>(2);
  const [layers, setLayers] = useState<Image[]>([]);

  function generateImagesFromLayers() {

  }

  function percentageOfColors() {

  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Bonjour</h1>
      <div className="container">
        <img src={sample} />
      </div>
    </div>
  )
}

export default App
