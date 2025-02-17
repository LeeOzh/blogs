import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './animate.css'
import AppRoutes from './routes/routes'
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  

  return (
    <>
    <Router>
      <AppRoutes />
    </Router>
    </>
  )
}

export default App
