import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Gavel, MessageSquare, Settings, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      className="fixed top-0 left-0 right-0 z-50 bg-nouns-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-nouns-grey dark:border-dark-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-4">
            <img
              src="/assets/db996353-1fad-4686-b3b5-bbc57e4b14a3_1500x500-removebg-preview.png"
              alt="NounsNet Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
            <span className="font-londrina text-lg sm:text-xl lg:text-2xl text-nouns-red">Nouniverse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className="relative group"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === path
                    ? 'bg-nouns-red text-white'
                    : 'text-nouns-dark-grey dark:text-dark-muted hover:text-nouns-text dark:hover:text-dark-text hover:bg-nouns-grey dark:hover:bg-dark-surface'
                    }`}
                >
                  <Icon size={14} />
                  <span className="font-pixel text-xs">{label}</span>
                </motion.div>
              </Link>
            ))}
            {/* Desktop Connect Wallet Button */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {account ? (
                <button
                  className="bg-nouns-blue text-white px-3 lg:px-4 py-2 rounded-lg font-pixel text-xs"
                  title={account}
                  onClick={() => setAccount('')}
                >
                  {shortAddress(account)}
                </button>
              ) : (
                <button
                  className="bg-nouns-red text-white px-3 lg:px-4 py-2 rounded-lg font-pixel text-xs hover:bg-nouns-blue transition-all"
                  onClick={() => connectMetaMask(setAccount, setError)}
                >
                  CONNECT
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-nouns-dark-grey dark:text-dark-muted hover:text-nouns-text dark:hover:text-dark-text hover:bg-nouns-grey dark:hover:bg-dark-surface transition-all"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pb-4 border-t border-nouns-grey dark:border-dark-border pt-4"
          >
            <div className="flex flex-col space-y-3">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative group"
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === path
                      ? 'bg-nouns-red text-white'
                      : 'text-nouns-dark-grey dark:text-dark-muted hover:text-nouns-text dark:hover:text-dark-text hover:bg-nouns-grey dark:hover:bg-dark-surface'
                      }`}
                  >
                    <Icon size={16} />
                    <span className="font-pixel text-xs">{label}</span>
                  </motion.div>
                </Link>
              ))}

              {/* Mobile Connect Wallet Button */}
              <div className="pt-2 border-t border-nouns-grey dark:border-dark-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-pixel text-nouns-dark-grey dark:text-dark-muted">THEME</span>
                  <ThemeToggle />
                </div>
                {account ? (
                  <button
                    className="w-full bg-nouns-blue text-white px-4 py-3 rounded-lg font-pixel text-xs flex items-center justify-center"
                    title={account}
                    onClick={() => {
                      setAccount('');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {shortAddress(account)} (Disconnect)
                  </button>
                ) : (
                  <button
                    className="w-full bg-nouns-red text-white px-4 py-3 rounded-lg font-pixel text-xs hover:bg-nouns-blue transition-all"
                    onClick={() => {
                      connectMetaMask(setAccount, setError);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    CONNECT WALLET
                  </button>
                )}
                {error && (
                  <div className="text-xs text-red-500 mt-2 font-pixel text-center">{error}</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;