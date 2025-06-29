import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Wallet, Bell, Shield, Palette, Globe } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

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
              <h3 className="font-londrina text-2xl font-bold">NOUN HOLDER #4521</h3>
              <p className="text-nouns-dark-grey">0x1234...5678</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-pixel mb-2">DISPLAY NAME</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                  placeholder="Enter display name"
                />
              </div>
              <div>
                <label className="block text-sm font-pixel mb-2">EMAIL</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-pixel mb-2">BIO</label>
              <textarea
                rows={4}
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
              <h3 className="font-pixel text-sm mb-4">CONNECTED WALLET</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">MetaMask</p>
                  <p className="text-sm text-nouns-dark-grey">0x1234...5678</p>
                </div>
                <div className="w-3 h-3 bg-nouns-green rounded-full"></div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-nouns-grey">
                <h4 className="font-pixel text-xs mb-2">ETH BALANCE</h4>
                <p className="font-londrina text-3xl font-bold">12.45 ETH</p>
                <p className="text-sm text-nouns-dark-grey">≈ $23,450 USD</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-nouns-grey">
                <h4 className="font-pixel text-xs mb-2">NOUNS OWNED</h4>
                <p className="font-londrina text-3xl font-bold">3</p>
                <p className="text-sm text-nouns-dark-grey">#4521, #4522, #4523</p>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            {[
              { title: 'Auction Updates', desc: 'Get notified about new auctions and bids' },
              { title: 'Proposal Alerts', desc: 'Receive updates on governance proposals' },
              { title: 'Community News', desc: 'Stay updated with community announcements' },
              { title: 'Price Alerts', desc: 'Get notified about significant price changes' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-nouns-grey">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-nouns-dark-grey">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nouns-red"></div>
                </label>
              </div>
            ))}
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
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
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
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-nouns-grey">
                <button className="px-6 py-3 border border-nouns-grey rounded-lg font-pixel text-xs text-nouns-dark-grey hover:text-nouns-text transition-colors">
                  CANCEL
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-nouns-red text-white rounded-lg font-pixel text-xs hover:shadow-lg transition-all duration-200"
                >
                  SAVE CHANGES
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;