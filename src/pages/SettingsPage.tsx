import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Wallet, Bell, Shield, Palette, Globe, Copy, Check, ExternalLink } from 'lucide-react';
import { useSettings } from '../config/endpoint';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
      on?: (eventName: string, callback: Function) => void;
      removeListener?: (eventName: string, callback: Function) => void;
    };
  }
}

interface ProfileData {
  displayName: string;
  email: string;
  bio: string;
}

interface NotificationSettings {
  auctionUpdates: boolean;
  proposalAlerts: boolean;
  communityNews: boolean;
  priceAlerts: boolean;
}

interface WalletData {
  address: string;
  isConnected: boolean;
  balance: string;
  nounsOwned: string[];
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Settings hooks
  const { ethRpc, graphApi, setEthRpc, setGraphApi } = useSettings();

  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    email: '',
    bio: ''
  });

  // Notification state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    auctionUpdates: true,
    proposalAlerts: true,
    communityNews: false,
    priceAlerts: false
  });

  // Wallet state
  const [walletData, setWalletData] = useState<WalletData>({
    address: '0x1234...5678',
    isConnected: false,
    balance: '0.00',
    nounsOwned: []
  });

  // Network settings state
  const [networkSettings, setNetworkSettings] = useState({
    ethRpc: ethRpc,
    graphApi: graphApi
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('nounsProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }

    const savedNotifications = localStorage.getItem('nounsNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    const savedWallet = localStorage.getItem('nounsWallet');
    if (savedWallet) {
      setWalletData(JSON.parse(savedWallet));
    }

    setNetworkSettings({
      ethRpc: ethRpc,
      graphApi: graphApi
    });

    // Check if wallet is already connected
    checkWalletConnection();
  }, [ethRpc, graphApi]);

  // Check if wallet is already connected
  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        }) as string[];

        if (accounts.length > 0) {
          // Wallet is connected, update state
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          }) as string;

          const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

          const connectedWalletData = {
            address: accounts[0],
            isConnected: true,
            balance: balanceInEth.toFixed(4),
            nounsOwned: ['#4521', '#4522', '#4523'] // Mock data
          };

          setWalletData(connectedWalletData);
          localStorage.setItem('nounsWallet', JSON.stringify(connectedWalletData));
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        }) as string[];

        if (accounts.length === 0) {
          alert('No accounts found. Please make sure MetaMask is unlocked.');
          return;
        }

        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        }) as string;

        // Convert balance from hex to ETH
        const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

        const newWalletData = {
          address: accounts[0],
          isConnected: true,
          balance: balanceInEth.toFixed(4),
          nounsOwned: ['#4521', '#4522', '#4523'] // Mock data - in real app, fetch from contract
        };

        setWalletData(newWalletData);
        localStorage.setItem('nounsWallet', JSON.stringify(newWalletData));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error: any) {
        console.error('Failed to connect wallet:', error);

        // Handle specific MetaMask errors
        if (error.code === 4001) {
          alert('Connection rejected. Please try again and approve the connection.');
        } else if (error.code === -32002) {
          alert('Connection request already pending. Please check MetaMask.');
        } else {
          alert(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
        }
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask from https://metamask.io/');
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    const newWalletData = {
      address: '',
      isConnected: false,
      balance: '0.00',
      nounsOwned: []
    };
    setWalletData(newWalletData);
    localStorage.setItem('nounsWallet', JSON.stringify(newWalletData));
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (walletData.address) {
      await navigator.clipboard.writeText(walletData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Save profile data
  const saveProfile = () => {
    setSaveStatus('saving');
    localStorage.setItem('nounsProfile', JSON.stringify(profileData));
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  // Save notification settings
  const saveNotifications = () => {
    setSaveStatus('saving');
    localStorage.setItem('nounsNotifications', JSON.stringify(notifications));
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  // Save network settings
  const saveNetworkSettings = () => {
    setSaveStatus('saving');
    setEthRpc(networkSettings.ethRpc);
    setGraphApi(networkSettings.graphApi);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  // Handle save based on active tab
  const handleSave = () => {
    switch (activeTab) {
      case 'profile':
        saveProfile();
        break;
      case 'notifications':
        saveNotifications();
        break;
      case 'network':
        saveNetworkSettings();
        break;
      default:
        break;
    }
  };

  const tabs = [
    { id: 'profile', label: 'PROFILE', icon: User },
    { id: 'wallet', label: 'WALLET', icon: Wallet },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: Bell },
    { id: 'security', label: 'SECURITY', icon: Shield },
    { id: 'appearance', label: 'APPEARANCE', icon: Palette },
    { id: 'network', label: 'NETWORK', icon: Globe },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-nouns-red to-nouns-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <img
                  src="/src/assets/noun-removebg-preview.png"
                  alt="Profile"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-londrina text-2xl font-bold">
                {profileData.displayName || 'NOUN HOLDER #4521'}
              </h3>
              <p className="text-nouns-dark-grey">
                {walletData.isConnected ? walletData.address : '0x1234...5678'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-pixel mb-2">DISPLAY NAME</label>
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                  placeholder="Enter display name"
                />
              </div>
              <div>
                <label className="block text-sm font-pixel mb-2">EMAIL</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-pixel mb-2">BIO</label>
              <textarea
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-6">
            <div className="bg-nouns-grey rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-sm">WALLET CONNECTION</h3>
                <div className={`w-3 h-3 rounded-full ${walletData.isConnected ? 'bg-nouns-green' : 'bg-red-500'}`}></div>
              </div>

              {walletData.isConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">MetaMask</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-nouns-dark-grey font-mono">
                          {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
                        </p>
                        <button
                          onClick={copyAddress}
                          className="text-nouns-red hover:text-nouns-blue transition-colors"
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-nouns-dark-grey mb-4">No wallet connected</p>
                  <button
                    onClick={connectWallet}
                    className="px-6 py-3 bg-nouns-red text-white rounded-lg hover:shadow-lg transition-all duration-200 font-pixel text-xs"
                  >
                    CONNECT WALLET
                  </button>
                </div>
              )}
            </div>

            {walletData.isConnected && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-nouns-grey">
                  <h4 className="font-pixel text-xs mb-2">ETH BALANCE</h4>
                  <p className="font-londrina text-3xl font-bold">{walletData.balance} ETH</p>
                  <p className="text-sm text-nouns-dark-grey">≈ ${(parseFloat(walletData.balance) * 2500).toFixed(0)} USD</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-nouns-grey">
                  <h4 className="font-pixel text-xs mb-2">NOUNS OWNED</h4>
                  <p className="font-londrina text-3xl font-bold">{walletData.nounsOwned.length}</p>
                  <p className="text-sm text-nouns-dark-grey">{walletData.nounsOwned.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            {[
              {
                key: 'auctionUpdates' as keyof NotificationSettings,
                title: 'Auction Updates',
                desc: 'Get notified about new auctions and bids'
              },
              {
                key: 'proposalAlerts' as keyof NotificationSettings,
                title: 'Proposal Alerts',
                desc: 'Receive updates on governance proposals'
              },
              {
                key: 'communityNews' as keyof NotificationSettings,
                title: 'Community News',
                desc: 'Stay updated with community announcements'
              },
              {
                key: 'priceAlerts' as keyof NotificationSettings,
                title: 'Price Alerts',
                desc: 'Get notified about significant price changes'
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-xl border border-nouns-grey">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-nouns-dark-grey">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications[item.key]}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nouns-red"></div>
                </label>
              </div>
            ))}

            <div className="bg-nouns-grey rounded-xl p-6">
              <h4 className="font-pixel text-xs mb-4">NOTIFICATION SUMMARY</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-nouns-dark-grey">Active notifications:</span>
                  <span className="ml-2 font-medium">
                    {Object.values(notifications).filter(Boolean).length}
                  </span>
                </div>
                <div>
                  <span className="text-nouns-dark-grey">Total settings:</span>
                  <span className="ml-2 font-medium">
                    {Object.keys(notifications).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'network':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <p className="text-sm font-medium text-yellow-800">
                  Advanced Settings - Only change if you know what you're doing
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-pixel mb-2">ETHEREUM RPC ENDPOINT</label>
                <input
                  type="url"
                  value={networkSettings.ethRpc}
                  onChange={(e) => setNetworkSettings({ ...networkSettings, ethRpc: e.target.value })}
                  className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red font-mono text-sm"
                  placeholder="https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY"
                />
                <p className="text-xs text-nouns-dark-grey mt-2">
                  RPC endpoint for Ethereum blockchain interactions
                </p>
              </div>

              <div>
                <label className="block text-sm font-pixel mb-2">GRAPH API ENDPOINT</label>
                <input
                  type="url"
                  value={networkSettings.graphApi}
                  onChange={(e) => setNetworkSettings({ ...networkSettings, graphApi: e.target.value })}
                  className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red font-mono text-sm"
                  placeholder="https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph"
                />
                <p className="text-xs text-nouns-dark-grey mt-2">
                  GraphQL endpoint for Nouns data queries
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-nouns-grey">
                <h4 className="font-pixel text-xs mb-4">CONNECTION STATUS</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ethereum RPC</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-nouns-green rounded-full"></div>
                      <span className="text-xs text-nouns-dark-grey">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Graph API</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-nouns-green rounded-full"></div>
                      <span className="text-xs text-nouns-dark-grey">Connected</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setNetworkSettings({
                    ethRpc: "https://eth-mainnet.alchemyapi.io/v2/demo",
                    graphApi: "https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph"
                  })}
                  className="px-4 py-2 text-sm border border-nouns-grey rounded-lg hover:bg-nouns-grey transition-colors"
                >
                  Reset to Defaults
                </button>
                <a
                  href="https://docs.alchemy.com/docs/alchemy-quickstart-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-4 py-2 text-sm text-nouns-red hover:text-nouns-blue transition-colors"
                >
                  <span>Get API Key</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-nouns-dark-grey">Settings for {activeTab} coming soon...</p>
          </div>
        );
    }
  };

  const shouldShowSaveButton = ['profile', 'notifications', 'network'].includes(activeTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="font-londrina text-6xl font-black mb-4">
            THE CONTROL <span className="text-nouns-green">ROOM</span>
          </h1>
          <p className="text-xl text-nouns-dark-grey">
            Manage your digital identity and preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-nouns-red text-white'
                      : 'text-nouns-dark-grey hover:text-nouns-text hover:bg-nouns-grey'
                      }`}
                  >
                    <tab.icon size={16} />
                    <span className="font-pixel text-xs">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-pixel text-lg mb-6">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              {renderTabContent()}

              {shouldShowSaveButton && (
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-nouns-grey">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 border border-nouns-grey rounded-lg font-pixel text-xs text-nouns-dark-grey hover:text-nouns-text transition-colors"
                  >
                    CANCEL
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className={`px-6 py-3 rounded-lg font-pixel text-xs transition-all duration-200 ${saveStatus === 'saved'
                      ? 'bg-nouns-green text-white'
                      : saveStatus === 'saving'
                        ? 'bg-nouns-dark-grey text-white cursor-not-allowed'
                        : 'bg-nouns-red text-white hover:shadow-lg'
                      }`}
                  >
                    {saveStatus === 'saving' ? 'SAVING...' : saveStatus === 'saved' ? 'SAVED!' : 'SAVE CHANGES'}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;