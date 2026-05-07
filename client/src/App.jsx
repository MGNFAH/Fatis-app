import { useState } from 'react'
import Home from './pages/Home'
import Explore from './pages/Explore'                         
import Profile from './pages/Profile'                         
import Login from './pages/Login'                             
import Navbar from './components/Navbar'    
import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App