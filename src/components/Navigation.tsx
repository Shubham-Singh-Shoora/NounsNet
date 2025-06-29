import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Gavel, MessageSquare, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'HOME' },
    { path: '/auction', icon: Gavel, label: 'AUCTION' },
    { path: '/proposals', icon: MessageSquare, label: 'PROPOSALS' },
    { path: '/settings', icon: Settings, label: 'SETTINGS' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-nouns-bg/95 backdrop-blur-sm border-b border-nouns-grey"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-nouns-red rounded-sm"></div>
            <span className="font-pixel text-sm text-nouns-red">NOUNSNET</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className="relative group"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === path
                      ? 'bg-nouns-red text-white'
                      : 'text-nouns-dark-grey hover:text-nouns-text hover:bg-nouns-grey'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-pixel text-xs">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;