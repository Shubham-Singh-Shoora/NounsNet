import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Wallet, Bell, Shield, Palette, Globe, Copy, Check, ExternalLink, Sun, Moon, Monitor } from 'lucide-react';
import { useSettings } from '../config/endpoint';
import { useTheme, type ThemeMode, type ThemeVariant } from '../contexts/ThemeContext';

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
  const { mode, variant, actualMode, setMode, setVariant } = useTheme();

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

  // Connection testing states
  const [connectionStatus, setConnectionStatus] = useState({
    ethRpc: { status: 'unknown', testing: false },
    graphApi: { status: 'unknown', testing: false }
  });

  // Test RPC connection
  const testRpcConnection = async (rpcUrl: string) => {
    if (!rpcUrl.trim()) return 'disconnected';

    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_blockNumber',
          params: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.result ? 'connected' : 'error';
      }
      return 'error';
    } catch {
      return 'error';
    }
  };

  // Test Graph API connection
  const testGraphConnection = async (graphUrl: string) => {
    if (!graphUrl.trim()) return 'disconnected';

    try {
      const response = await fetch(graphUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '{ __schema { queryType { name } } }'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.data ? 'connected' : 'error';
      }
      return 'error';
    } catch {
      return 'error';
    }
  };

  // Test individual connection
  const testConnection = async (type: 'ethRpc' | 'graphApi') => {
    setConnectionStatus(prev => ({
      ...prev,
      [type]: { ...prev[type], testing: true }
    }));

    const url = type === 'ethRpc' ? networkSettings.ethRpc : networkSettings.graphApi;
    const testFn = type === 'ethRpc' ? testRpcConnection : testGraphConnection;

    const status = await testFn(url);

    setConnectionStatus(prev => ({
      ...prev,
      [type]: { status, testing: false }
    }));
  };

  // Test all connections
  const testAllConnections = async () => {
    await Promise.all([
      testConnection('ethRpc'),
      testConnection('graphApi')
    ]);
  };

  // Auto-test connections when settings change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      testAllConnections();
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [networkSettings.ethRpc, networkSettings.graphApi]);

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
      case 'appearance':
        // Theme settings are automatically saved via the ThemeProvider
        setSaveStatus('saving');
        setTimeout(() => {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-pixel">ETHEREUM RPC ENDPOINT</label>
                  <button
                    onClick={() => testConnection('ethRpc')}
                    disabled={connectionStatus.ethRpc.testing}
                    className="text-xs px-2 py-1 bg-nouns-blue text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {connectionStatus.ethRpc.testing ? 'Testing...' : 'Test'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="url"
                    value={networkSettings.ethRpc}
                    onChange={(e) => setNetworkSettings({ ...networkSettings, ethRpc: e.target.value })}
                    className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red font-mono text-sm pr-10"
                    placeholder="https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {connectionStatus.ethRpc.testing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-nouns-blue"></div>
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${connectionStatus.ethRpc.status === 'connected' ? 'bg-nouns-green' :
                        connectionStatus.ethRpc.status === 'error' ? 'bg-red-500' :
                          'bg-gray-300'
                        }`}></div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-nouns-dark-grey">
                    RPC endpoint for Ethereum blockchain interactions
                  </p>
                  <span className={`text-xs font-pixel ${connectionStatus.ethRpc.status === 'connected' ? 'text-nouns-green' :
                    connectionStatus.ethRpc.status === 'error' ? 'text-red-500' :
                      'text-nouns-dark-grey'
                    }`}>
                    {connectionStatus.ethRpc.status === 'connected' ? 'CONNECTED' :
                      connectionStatus.ethRpc.status === 'error' ? 'CONNECTION FAILED' :
                        'NOT TESTED'}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-pixel">GRAPH API ENDPOINT</label>
                  <button
                    onClick={() => testConnection('graphApi')}
                    disabled={connectionStatus.graphApi.testing}
                    className="text-xs px-2 py-1 bg-nouns-blue text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {connectionStatus.graphApi.testing ? 'Testing...' : 'Test'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="url"
                    value={networkSettings.graphApi}
                    onChange={(e) => setNetworkSettings({ ...networkSettings, graphApi: e.target.value })}
                    className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red font-mono text-sm pr-10"
                    placeholder="https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {connectionStatus.graphApi.testing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-nouns-blue"></div>
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${connectionStatus.graphApi.status === 'connected' ? 'bg-nouns-green' :
                        connectionStatus.graphApi.status === 'error' ? 'bg-red-500' :
                          'bg-gray-300'
                        }`}></div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-nouns-dark-grey">
                    GraphQL endpoint for Nouns data queries
                  </p>
                  <span className={`text-xs font-pixel ${connectionStatus.graphApi.status === 'connected' ? 'text-nouns-green' :
                    connectionStatus.graphApi.status === 'error' ? 'text-red-500' :
                      'text-nouns-dark-grey'
                    }`}>
                    {connectionStatus.graphApi.status === 'connected' ? 'CONNECTED' :
                      connectionStatus.graphApi.status === 'error' ? 'CONNECTION FAILED' :
                        'NOT TESTED'}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-nouns-grey">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-pixel text-xs">CONNECTION STATUS</h4>
                  <button
                    onClick={testAllConnections}
                    disabled={connectionStatus.ethRpc.testing || connectionStatus.graphApi.testing}
                    className="text-xs px-3 py-1 bg-nouns-green text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Test All
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ethereum RPC</span>
                    <div className="flex items-center space-x-2">
                      {connectionStatus.ethRpc.testing ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-nouns-blue"></div>
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${connectionStatus.ethRpc.status === 'connected' ? 'bg-nouns-green' :
                          connectionStatus.ethRpc.status === 'error' ? 'bg-red-500' :
                            'bg-gray-300'
                          }`}></div>
                      )}
                      <span className="text-xs text-nouns-dark-grey">
                        {connectionStatus.ethRpc.testing ? 'Testing...' :
                          connectionStatus.ethRpc.status === 'connected' ? 'Connected' :
                            connectionStatus.ethRpc.status === 'error' ? 'Failed' :
                              'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Graph API</span>
                    <div className="flex items-center space-x-2">
                      {connectionStatus.graphApi.testing ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-nouns-blue"></div>
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${connectionStatus.graphApi.status === 'connected' ? 'bg-nouns-green' :
                          connectionStatus.graphApi.status === 'error' ? 'bg-red-500' :
                            'bg-gray-300'
                          }`}></div>
                      )}
                      <span className="text-xs text-nouns-dark-grey">
                        {connectionStatus.graphApi.testing ? 'Testing...' :
                          connectionStatus.graphApi.status === 'connected' ? 'Connected' :
                            connectionStatus.graphApi.status === 'error' ? 'Failed' :
                              'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    const defaults = {
                      ethRpc: import.meta.env.VITE_ETH_RPC || "https://eth-mainnet.alchemyapi.io/v2/demo",
                      graphApi: "https://api.goldsky.com/api/public/project_cldf2o9pqtjbm49vm6ebkw02y/subgraphs/nouns-subgraph/prod/gn"
                    };
                    setNetworkSettings(defaults);
                  }}
                  className="px-4 py-2 text-sm border border-nouns-grey rounded-lg hover:bg-nouns-grey transition-colors"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={testAllConnections}
                  disabled={connectionStatus.ethRpc.testing || connectionStatus.graphApi.testing}
                  className="px-4 py-2 text-sm bg-nouns-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Test Connections
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

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-nouns-red/10 to-nouns-blue/10 rounded-xl p-6 border border-nouns-grey dark:border-dark-border">
              <h3 className="font-pixel text-sm mb-4 flex items-center space-x-2">
                <Palette size={16} />
                <span>VISUAL PREFERENCES</span>
              </h3>
              <p className="text-sm text-nouns-dark-grey dark:text-dark-muted mb-4">
                Customize your viewing experience with different themes and color schemes.
              </p>
            </div>

            {/* Theme Mode Selection */}
            <div className="bg-white dark:bg-dark-surface rounded-xl p-6 border border-nouns-grey dark:border-dark-border">
              <h4 className="font-pixel text-xs mb-4">THEME MODE</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Light', icon: Sun, desc: 'Bright and clean' },
                  { value: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
                  { value: 'auto', label: 'Auto', icon: Monitor, desc: 'Follows system' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setMode(option.value as ThemeMode)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${mode === option.value
                        ? 'border-nouns-red bg-nouns-red/10 text-nouns-red'
                        : 'border-nouns-grey dark:border-dark-border hover:border-nouns-red/50 dark:hover:border-nouns-red/50'
                      }`}
                  >
                    <option.icon size={24} className="mx-auto mb-2" />
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-nouns-dark-grey dark:text-dark-muted">{option.desc}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-nouns-grey dark:bg-dark-bg rounded-lg">
                <div className="text-xs text-nouns-dark-grey dark:text-dark-muted">
                  Current mode: <span className="font-medium capitalize">{actualMode}</span>
                  {mode === 'auto' && (
                    <span className="ml-2 text-nouns-blue">(Auto-detected)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Theme Variant Selection */}
            <div className="bg-white dark:bg-dark-surface rounded-xl p-6 border border-nouns-grey dark:border-dark-border">
              <h4 className="font-pixel text-xs mb-4">COLOR SCHEME</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    value: 'default',
                    label: 'Nouns Original',
                    colors: ['#D63638', '#2563EB', '#059669'],
                    desc: 'Classic Nouns colors'
                  },
                  {
                    value: 'neon',
                    label: 'Neon Cyber',
                    colors: ['#00FF88', '#FF0080', '#00D4FF'],
                    desc: 'Futuristic vibes'
                  },
                  {
                    value: 'warm',
                    label: 'Warm Earth',
                    colors: ['#D2691E', '#8B4513', '#FF6347'],
                    desc: 'Cozy and natural'
                  },
                  {
                    value: 'cool',
                    label: 'Cool Ocean',
                    colors: ['#4682B4', '#5F9EA0', '#00CED1'],
                    desc: 'Calm and refreshing'
                  }
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setVariant(theme.value as ThemeVariant)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${variant === theme.value
                        ? 'border-nouns-red bg-nouns-red/10'
                        : 'border-nouns-grey dark:border-dark-border hover:border-nouns-red/50 dark:hover:border-nouns-red/50'
                      }`}
                  >
                    <div className="flex space-x-1 mb-2 justify-center">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-sm font-medium">{theme.label}</div>
                    <div className="text-xs text-nouns-dark-grey dark:text-dark-muted mt-1">
                      {theme.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white dark:bg-dark-surface rounded-xl p-6 border border-nouns-grey dark:border-dark-border">
              <h4 className="font-pixel text-xs mb-4">PREVIEW</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-nouns-grey dark:bg-dark-bg rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-nouns-red rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">N</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Noun #1234</div>
                      <div className="text-xs text-nouns-dark-grey dark:text-dark-muted">Preview Card</div>
                    </div>
                  </div>
                  <div className="text-xs text-nouns-dark-grey dark:text-dark-muted">
                    This is how content will look with your selected theme.
                  </div>
                </div>
                <div className="p-4 bg-nouns-bg dark:bg-dark-bg rounded-lg border border-nouns-grey dark:border-dark-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Current Theme</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-nouns-green rounded-full"></div>
                      <span className="text-xs text-nouns-dark-grey dark:text-dark-muted">Active</span>
                    </div>
                  </div>
                  <div className="text-xs text-nouns-dark-grey dark:text-dark-muted">
                    Mode: {actualMode} | Variant: {variant}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white dark:bg-dark-surface rounded-xl p-6 border border-nouns-grey dark:border-dark-border">
              <h4 className="font-pixel text-xs mb-4">ADVANCED</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Reduce Motion</div>
                    <div className="text-xs text-nouns-dark-grey dark:text-dark-muted">
                      Minimize animations for better performance
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={(e) => {
                        if (e.target.checked) {
                          document.documentElement.style.setProperty('--animation-duration', '0s');
                        } else {
                          document.documentElement.style.removeProperty('--animation-duration');
                        }
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nouns-red"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">High Contrast</div>
                    <div className="text-xs text-nouns-dark-grey dark:text-dark-muted">
                      Increase contrast for better accessibility
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={(e) => {
                        if (e.target.checked) {
                          document.documentElement.classList.add('high-contrast');
                        } else {
                          document.documentElement.classList.remove('high-contrast');
                        }
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nouns-red"></div>
                  </label>
                </div>
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

  const shouldShowSaveButton = ['profile', 'notifications', 'network', 'appearance'].includes(activeTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-20 min-h-screen bg-nouns-bg dark:bg-dark-bg transition-colors duration-300"
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
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-lg border border-nouns-grey dark:border-dark-border">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-nouns-red text-white'
                      : 'text-nouns-dark-grey dark:text-dark-muted hover:text-nouns-text dark:hover:text-dark-text hover:bg-nouns-grey dark:hover:bg-dark-bg'
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
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 shadow-lg border border-nouns-grey dark:border-dark-border">
              <h2 className="font-pixel text-lg mb-6 text-nouns-text dark:text-dark-text">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              {renderTabContent()}

              {shouldShowSaveButton && (
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-nouns-grey dark:border-dark-border">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 border border-nouns-grey dark:border-dark-border rounded-lg font-pixel text-xs text-nouns-dark-grey dark:text-dark-muted hover:text-nouns-text dark:hover:text-dark-text transition-colors"
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