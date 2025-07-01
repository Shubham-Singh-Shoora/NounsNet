import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Gavel, MessageSquare, Settings } from 'lucide-react';

// Metamask connect helper
async function connectMetaMask(setAccount: (acc: string) => void, setError: (msg: string) => void) {
  if (!(window as any).ethereum) {
    setError("MetaMask not detected");
    return;
  }
  try {
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    setError('');
  } catch (err: any) {
    setError(err?.message || "Failed to connect");
  }
}

const Navigation = () => {
  const location = useLocation();
  const [account, setAccount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navItems = [
    { path: '/', icon: Home, label: 'HOME' },
    { path: '/auction', icon: Gavel, label: 'AUCTION' },
    { path: '/proposals', icon: MessageSquare, label: 'PROPOSALS' },
    { path: '/settings', icon: Settings, label: 'SETTINGS' },
  ];

  // Shorten address for display
  const shortAddress = (addr: string) =>
    addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-nouns-bg/95 backdrop-blur-sm border-b border-nouns-grey"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <img
              src="/src/assets/db996353-1fad-4686-b3b5-bbc57e4b14a3_1500x500-removebg-preview.png"
              alt="NounsNet Logo"
              className="w-16 h-16 object-contain"
            />
            <span className="font-londrina lg:text-2xl text-sm text-nouns-red">NounsNet</span>
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === path
                    ? 'bg-nouns-red text-white'
                    : 'text-nouns-dark-grey hover:text-nouns-text hover:bg-nouns-grey'
                    }`}
                >
                  <Icon size={16} />
                  <span className="font-pixel text-xs">{label}</span>
                </motion.div>
              </Link>
            ))}
            {/* Connect Wallet Button */}
            <div>
              {account ? (
                <button
                  className="bg-nouns-blue text-white px-4 py-2 rounded-lg font-pixel text-xs"
                  title={account}
                  onClick={() => setAccount('')}
                >
                  {shortAddress(account)} (Disconnect)
                </button>
              ) : (
                <button
                  className="bg-nouns-red text-white px-4 py-2 rounded-lg font-pixel text-xs hover:bg-nouns-blue transition-all"
                  onClick={() => connectMetaMask(setAccount, setError)}
                >
                  CONNECT WALLET
                </button>
              )}
              {error && (
                <div className="text-xs text-red-500 mt-1 font-pixel">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;