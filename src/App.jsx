import React from 'react'
import './App.css'
import ConverterForm from './components/ConverterForm'
import GraphDisplay from './GraphDisplay'

const App = () => {
  return (
    <div className='currency-converter'>
      <h2 className='converter-title'>Currency Converter</h2>
      <ConverterForm />
      <GraphDisplay />
    </div>
  )
}

export default App
