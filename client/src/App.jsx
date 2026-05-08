
import Home from './pages/Home'
import Explore from './pages/Explore'                         
import Profile from './pages/Profile'                         
import Login from './pages/Login'                             
import Navbar from './components/Navbar'
import CategoryBar from "./components/CategoryBar";  
import { BrowserRouter, Routes, Route } from 'react-router'

function App() {

  return (
      <BrowserRouter>
      <Navbar />
      <CategoryBar />
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