import React from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RBIGuide from "./pages/RBIGuide";
import LoanTools from "./pages/LoanTools";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rbi-guide" element={<RBIGuide />} />
        <Route path="/tools" element={<LoanTools />} />
      </Routes>
    </HashRouter>
  );
}

export default App;