import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import AuctionPage from './pages/AuctionPage';
import ProposalsPage from './pages/ProposalsPage';
import SettingsPage from './pages/SettingsPage';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-nouns-bg text-nouns-text font-inter">
        <Navigation />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auction" element={<AuctionPage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;