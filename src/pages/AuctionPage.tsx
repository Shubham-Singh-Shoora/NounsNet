import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, DollarSign, Gavel } from 'lucide-react';

const AuctionPage = () => {
  const [currentBid, setCurrentBid] = useState(12.5);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 23, seconds: 15 });

  const bidHistory = [
    { bidder: '0x1234...5678', amount: 12.5, time: '2 minutes ago' },
    { bidder: '0x9876...5432', amount: 11.8, time: '8 minutes ago' },
    { bidder: '0x4567...8901', amount: 10.2, time: '15 minutes ago' },
    { bidder: '0x2345...6789', amount: 9.5, time: '23 minutes ago' },
  ];

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
            THE <span className="text-nouns-red">AUCTION</span> HOUSE
          </h1>
          <p className="text-xl text-nouns-dark-grey">
            Bid on today's unique digital artifact
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Noun Display */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <h2 className="font-pixel text-lg mb-2">NOUN 4521</h2>
                <p className="text-nouns-dark-grey">Today's Featured Artifact</p>
              </div>
              <div className="bg-gradient-to-br from-nouns-blue to-nouns-green rounded-2xl p-8">
                <img 
                  src="/src/assets/noun-removebg-preview.png" 
                  alt="Noun 4521" 
                  className="w-full h-64 object-contain animate-float"
                />
              </div>
            </div>

            {/* Noun Traits */}
            <div className="bg-nouns-grey rounded-2xl p-6">
              <h3 className="font-pixel text-sm mb-4">TRAITS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-nouns-dark-grey">BACKGROUND</span>
                  <p className="font-medium">Cool</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-nouns-dark-grey">BODY</span>
                  <p className="font-medium">Red</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-nouns-dark-grey">ACCESSORY</span>
                  <p className="font-medium">Glasses</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs text-nouns-dark-grey">HEAD</span>
                  <p className="font-medium">Crown</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Auction Info */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Timer */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-sm">AUCTION ENDS IN</h3>
                <Clock className="text-nouns-red" size={20} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-nouns-grey rounded-lg p-4">
                  <div className="font-londrina text-3xl font-black">{timeLeft.hours}</div>
                  <div className="text-xs text-nouns-dark-grey">HOURS</div>
                </div>
                <div className="bg-nouns-grey rounded-lg p-4">
                  <div className="font-londrina text-3xl font-black">{timeLeft.minutes}</div>
                  <div className="text-xs text-nouns-dark-grey">MINUTES</div>
                </div>
                <div className="bg-nouns-grey rounded-lg p-4">
                  <div className="font-londrina text-3xl font-black">{timeLeft.seconds}</div>
                  <div className="text-xs text-nouns-dark-grey">SECONDS</div>
                </div>
              </div>
            </div>

            {/* Current Bid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-sm">CURRENT BID</h3>
                <DollarSign className="text-nouns-green" size={20} />
              </div>
              <div className="text-center">
                <div className="font-londrina text-5xl font-black text-nouns-red mb-2">
                  {currentBid} ETH
                </div>
                <p className="text-nouns-dark-grey">≈ $23,450 USD</p>
              </div>
            </div>

            {/* Bid Form */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-pixel text-sm mb-4">PLACE BID</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    className="flex-1 px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                    step="0.1"
                    min={currentBid + 0.1}
                  />
                  <span className="font-medium text-nouns-dark-grey">ETH</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-nouns-red text-white py-4 rounded-lg font-pixel text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Gavel size={16} />
                  <span>PLACE BID</span>
                </motion.button>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-sm">BID HISTORY</h3>
                <Users className="text-nouns-blue" size={20} />
              </div>
              <div className="space-y-3">
                {bidHistory.map((bid, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between py-2 border-b border-nouns-grey last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{bid.bidder}</p>
                      <p className="text-xs text-nouns-dark-grey">{bid.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-nouns-red">{bid.amount} ETH</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionPage;