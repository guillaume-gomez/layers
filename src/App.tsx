import { useState } from 'react'
import sample from './assets/sample.png'

import './App.css'

function App() {

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
