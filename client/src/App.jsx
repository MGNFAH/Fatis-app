import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";

function App() {
  const [sparkCount, setSparkCount] = useState(0);

  return (
    <BrowserRouter>
      <Navbar sparkCount={sparkCount} />
      <CategoryBar />
      <Routes>
        <Route
          path="/"
          element={<Home onSpark={() => setSparkCount((c) => c + 1)} />}
        />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
