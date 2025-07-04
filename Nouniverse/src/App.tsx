import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import AuctionPage from './pages/AuctionPage';
import ProposalsPage from './pages/ProposalsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import Navigation from './components/Navigation';
import { SettingsProvider } from './config/endpoint';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen bg-nouns-bg dark:bg-dark-bg text-nouns-text dark:text-dark-text font-inter transition-colors duration-300">
            <Navigation />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auction" element={<AuctionPage />} />
                <Route path="/proposals" element={<ProposalsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;