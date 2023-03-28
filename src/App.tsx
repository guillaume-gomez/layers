import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
