import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, DollarSign, Gavel } from 'lucide-react';
import { useNounTraits } from '../hooks/useNounTraits';
import { useAuctionBids } from '../hooks/useAuctionBids';
import { useNounData } from '../hooks/useNounData';
import { ImageData } from '@nouns/assets';



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

interface WalletData {
  address: string;
  isConnected: boolean;
  balance: string;
  nounsOwned: string[];
}

const getTraitName = (traitType: string, traitId: string | number): string => {
  try {
    const id = Number(traitId);
    const { bgcolors, images } = ImageData;
    const { bodies, accessories, heads, glasses } = images;

    switch (traitType) {
      case 'background':
        return bgcolors[id] || `Background #${id}`;
      case 'body':
        return bodies[id]?.filename?.replace('.png', '') || `Body #${id}`;
      case 'accessory':
        return accessories[id]?.filename?.replace('.png', '') || 'None';
      case 'head':
        return heads[id]?.filename?.replace('.png', '') || `Head #${id}`;
      case 'glasses':
        return glasses[id]?.filename?.replace('.png', '') || 'None';
      default:
        return `#${id}`;
    }
  } catch (error) {
    console.warn(`Error getting trait name for ${traitType}:${traitId}`, error);
    return `#${traitId}`;
  }
};

// Function to get trait color/style for display
const getTraitColor = (traitType: string, traitId: string | number): string => {
  try {
    const id = Number(traitId);
    const { bgcolors } = ImageData;

    switch (traitType) {
      case 'background':
        // Get the actual color from ImageData if available
        const bgColor = bgcolors[id];
        return bgColor ? `bg-[${bgColor}]` : 'bg-gray-100';
      case 'body':
        return 'bg-blue-100';
      case 'accessory':
        return 'bg-purple-100';
      case 'head':
        return 'bg-green-100';
      case 'glasses':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  } catch {
    return 'bg-gray-100';
  }
};

function useCountdown(targetTimestamp: number | undefined) {
  const [secondsLeft, setSecondsLeft] = React.useState(() => {
    if (!targetTimestamp) return 0;
    return Math.max(targetTimestamp - Math.floor(Date.now() / 1000), 0);
  });

  React.useEffect(() => {
    if (!targetTimestamp) return;
    const interval = setInterval(() => {
      setSecondsLeft(Math.max(targetTimestamp - Math.floor(Date.now() / 1000), 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return { hours, minutes, seconds, secondsLeft };
}

// Better image URL construction with working fallbacks
const getNounImageUrls = (nounId: string | undefined): string[] => {
  if (!nounId) return ['/api/placeholder/300/300'];

  return [
    // Try official Nouns API endpoints
    `https://noun.pics/${nounId}.png`,
    // Generic placeholder as ultimate fallback
    '/api/placeholder/300/300'
  ];
};

// Placeholder SVG component for when all images fail
const NounPlaceholder = ({ nounId, className }: { nounId: string | undefined, className: string }) => {
  return (
    <div className={`${className} bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center rounded-lg`}>
      <div className="text-center text-white">
        <div className="text-6xl mb-2">🏛️</div>
        <div className="font-pixel text-sm">NOUN {nounId || '?'}</div>
        <div className="text-xs opacity-75 mt-1">Image Loading...</div>
      </div>
    </div>
  );
};

// Component for handling multiple image fallbacks
const NounImage = ({ nounId, className }: { nounId: string | undefined, className: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageUrls = getNounImageUrls(nounId);

  const handleImageError = () => {
    console.log(`Failed to load image ${currentImageIndex}: ${imageUrls[currentImageIndex]}`);
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setIsLoading(true); // Reset loading state for next image
    } else {
      setImageError(true);
      setIsLoading(false);
      console.log('All image URLs failed to load, showing placeholder');
    }
  };

  const handleImageLoad = () => {
    console.log(`Successfully loaded image: ${imageUrls[currentImageIndex]}`);
    setImageError(false);
    setIsLoading(false);
  };

  // Reset states when nounId changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(false);
    setIsLoading(true);
  }, [nounId]);

  // If all images failed, show placeholder
  if (imageError) {
    return <NounPlaceholder nounId={nounId} className={className} />;
  }

  return (
    <div className="relative">
      <img
        src={imageUrls[currentImageIndex]}
        alt={`Noun ${nounId || 'Unknown'}`}
        className={`${className} transition-opacity duration-200`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          opacity: isLoading ? 0.5 : 1
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};


// Individual trait component for better styling
const TraitCard = ({
  label,
  traitType,
  traitId,
  className = ""
}: {
  label: string;
  traitType: string;
  traitId: string | number | undefined;
  className?: string;
}) => {
  const traitName = traitId !== undefined ? getTraitName(traitType, traitId) : "—";
  const colorClass = traitId !== undefined ? getTraitColor(traitType, traitId) : "bg-gray-100";

  return (
    <div className={`bg-white rounded-lg p-3 border-l-4 border-nouns-red ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-pixel text-nouns-dark-grey uppercase">{label}</span>
        <div className={`w-3 h-3 rounded-full ${colorClass} border`}></div>
      </div>
      <p className="font-medium text-sm truncate" title={traitName}>
        {traitName}
      </p>
      {traitId !== undefined && (
        <p className="text-xs text-nouns-dark-grey mt-1">ID: {traitId}</p>
      )}
    </div>
  );
};


const AuctionPage = () => {
  const { auction, loading: auctionLoading, error: auctionError } = useNounData();
  const nounId = auction?.nounId?.toString();
  const { traits, loading: traitsLoading } = useNounTraits(nounId);
  const { bids, loading: bidsLoading, error: bidsError } = useAuctionBids(nounId);

  // Wallet state - get from localStorage (persisted from SettingsPage)
  const [walletData, setWalletData] = useState<WalletData>({
    address: '',
    isConnected: false,
    balance: '0.00',
    nounsOwned: []
  });

  // Bidding state
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isBidding, setIsBidding] = useState(false);
  const [bidError, setBidError] = useState<string>('');

  // Timer
  const endTime = auction?.endTime ? Number(auction.endTime) : undefined;
  const { hours, minutes, seconds } = useCountdown(endTime);

  // Current bid is highest bid or from auction data
  const currentBid = bids.length > 0
    ? Number(bids[0].amount) / 1e18
    : auction?.amount
      ? Number(auction.amount) / 1e18
      : 0;

  // Load wallet data from localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem('nounsWallet');
    if (savedWallet) {
      const walletInfo = JSON.parse(savedWallet);
      setWalletData(walletInfo);
    }

    // Listen for wallet changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletData({
            address: '',
            isConnected: false,
            balance: '0.00',
            nounsOwned: []
          });
          localStorage.removeItem('nounsWallet');
        }
      };

      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        }) as string[];

        if (accounts.length === 0) {
          setBidError('No accounts found. Please make sure MetaMask is unlocked.');
          return;
        }

        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        }) as string;

        const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

        const newWalletData = {
          address: accounts[0],
          isConnected: true,
          balance: balanceInEth.toFixed(4),
          nounsOwned: ['#4521', '#4522', '#4523'] // Mock data - replace with actual contract call
        };

        setWalletData(newWalletData);
        localStorage.setItem('nounsWallet', JSON.stringify(newWalletData));
        setBidError('');
      } catch (error: any) {
        console.error('Failed to connect wallet:', error);
        setBidError(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
      }
    } else {
      setBidError('MetaMask is not installed. Please install MetaMask from https://metamask.io/');
    }
  };

  // Place bid function
  const placeBid = async () => {
    if (!walletData.isConnected) {
      setBidError('Please connect your wallet first');
      return;
    }

    const bidValue = parseFloat(bidAmount);
    const minBid = currentBid > 0 ? currentBid + 0.01 : 0.01;

    if (isNaN(bidValue) || bidValue < minBid) {
      setBidError(`Bid must be at least ${minBid.toFixed(2)} ETH`);
      return;
    }

    if (bidValue > parseFloat(walletData.balance)) {
      setBidError('Insufficient balance');
      return;
    }

    setIsBidding(true);
    setBidError('');

    try {
      // Here you would interact with the actual Nouns auction contract
      // For demo purposes, we'll simulate a successful bid
      console.log('Placing bid:', {
        nounId,
        bidAmount: bidValue,
        bidder: walletData.address
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, you would:
      // 1. Call the auction contract's createBid function
      // 2. Wait for transaction confirmation
      // 3. Update the UI with the new bid

      alert(`Bid of ${bidValue} ETH placed successfully! (Demo)`);
      setBidAmount('');

    } catch (error: any) {
      console.error('Error placing bid:', error);
      setBidError(`Failed to place bid: ${error.message || 'Unknown error'}`);
    } finally {
      setIsBidding(false);
    }
  };

  // Check if user can bid
  const canBid = walletData.isConnected && !isBidding && hours > 0 || minutes > 0 || seconds > 0;
  const minBidAmount = currentBid > 0 ? currentBid + 0.01 : 0.01;



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
                <h2 className="font-londrina lg:text-2xl text-lg mb-2">
                  NOUN {nounId ?? "—"}
                </h2>
                <p className="text-nouns-dark-grey">Today's Featured Artifact</p>
                {auctionLoading && (
                  <p className="text-xs text-nouns-dark-grey mt-2">Loading auction data...</p>
                )}
                {auctionError && (
                  <p className="text-xs text-nouns-red mt-2">Error: {auctionError}</p>
                )}
              </div>
              <div className="bg-gradient-to-br from-nouns-cool-grey to-nouns-warm-grey rounded-2xl p-8">
                <NounImage
                  nounId={nounId}
                  className="w-full h-64 object-contain  transition-transform transform hover:scale-105"
                />
              </div>
            </div>

            {/* Noun Traits */}
            <div className="bg-nouns-grey rounded-2xl p-6">
              <h3 className="font-pixel text-sm mb-4 flex items-center">
                <span>TRAITS</span>
                {traitsLoading && (
                  <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-nouns-red"></div>
                )}
              </h3>

              {traits?.seed ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TraitCard
                    label="Background"
                    traitType="background"
                    traitId={traits.seed.background}
                  />
                  <TraitCard
                    label="Body"
                    traitType="body"
                    traitId={traits.seed.body}
                  />
                  <TraitCard
                    label="Accessory"
                    traitType="accessory"
                    traitId={traits.seed.accessory}
                  />
                  <TraitCard
                    label="Head"
                    traitType="head"
                    traitId={traits.seed.head}
                  />
                  <TraitCard
                    label="Glasses"
                    traitType="glasses"
                    traitId={traits.seed.glasses}
                    className="md:col-span-2"
                  />
                </div>
              ) : (
                <div className="text-center text-xs text-nouns-dark-grey bg-white rounded-lg p-6">
                  {traitsLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-nouns-red"></div>
                      <span>Loading traits...</span>
                    </div>
                  ) : !nounId ? (
                    "No noun selected"
                  ) : (
                    "No trait data available"
                  )}
                </div>
              )}
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
                  <div className="font-londrina text-3xl font-black">{hours}</div>
                  <div className="text-xs text-nouns-dark-grey">HOURS</div>
                </div>
                <div className="bg-nouns-grey rounded-lg p-4">
                  <div className="font-londrina text-3xl font-black">{minutes}</div>
                  <div className="text-xs text-nouns-dark-grey">MINUTES</div>
                </div>
                <div className="bg-nouns-grey rounded-lg p-4">
                  <div className="font-londrina text-3xl font-black">{seconds}</div>
                  <div className="text-xs text-nouns-dark-grey">SECONDS</div>
                </div>
              </div>
              {auctionLoading && <div className="text-xs text-nouns-dark-grey text-center mt-3">Loading auction...</div>}
              {auctionError && <div className="text-xs text-nouns-red text-center mt-3">Auction Error: {auctionError}</div>}
            </div>

            {/* Current Bid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-sm">CURRENT BID</h3>
                <DollarSign className="text-nouns-green" size={20} />
              </div>
              <div className="text-center">
                <div className="font-londrina text-5xl font-black text-nouns-red mb-2">
                  {currentBid > 0 ? `${currentBid.toFixed(2)} ETH` : "No bids yet"}
                </div>
                <p className="text-nouns-dark-grey">
                  {(bids.length > 0 && bids[0]?.bidderDisplayName)
                    ? `Top Bidder: ${bids[0].bidderDisplayName}`
                    : auction?.bidder && auction.bidder !== "0x0000000000000000000000000000000000000000"
                      ? `Current Bidder: ${auction.bidder.slice(0, 6)}...${auction.bidder.slice(-4)}`
                      : "No bidders yet"}
                </p>
              </div>
            </div>

            {/* Bid Form */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-sm">PLACE BID</h3>
                {walletData.isConnected && (
                  <div className="text-xs text-nouns-dark-grey">
                    Balance: {walletData.balance} ETH
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    placeholder={`Min: ${minBidAmount.toFixed(2)} ETH`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1 px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                    step="0.01"
                    min={minBidAmount}
                    disabled={!walletData.isConnected || isBidding}
                  />
                  <span className="font-medium text-nouns-dark-grey">ETH</span>
                </div>

                {bidError && (
                  <div className="text-xs text-red-500 text-center bg-red-50 p-2 rounded">
                    {bidError}
                  </div>
                )}

                {!walletData.isConnected ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={connectWallet}
                    className="w-full bg-nouns-blue text-white py-4 rounded-lg font-pixel text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>CONNECT WALLET TO BID</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: canBid ? 1.02 : 1 }}
                    whileTap={{ scale: canBid ? 0.98 : 1 }}
                    onClick={placeBid}
                    disabled={!canBid}
                    className={`w-full py-4 rounded-lg font-pixel text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${canBid
                      ? 'bg-nouns-red text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {isBidding ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>PLACING BID...</span>
                      </>
                    ) : (
                      <>
                        <Gavel size={16} />
                        <span>PLACE BID</span>
                      </>
                    )}
                  </motion.button>
                )}

                <div className="text-xs text-nouns-dark-grey text-center">
                  {walletData.isConnected ? (
                    <>
                      Connected: {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
                      <br />
                      Minimum bid: {minBidAmount.toFixed(2)} ETH
                    </>
                  ) : (
                    'Connect your wallet to participate in the auction'
                  )}
                </div>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-sm">BID HISTORY</h3>
                <Users className="text-nouns-blue" size={20} />
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bidsLoading && (
                  <div className="text-center text-xs text-nouns-dark-grey py-4">
                    Loading bid history...
                  </div>
                )}
                {bidsError && (
                  <div className="text-xs text-nouns-red text-center py-4">
                    Error loading bids: {bidsError}
                  </div>
                )}
                {!bidsLoading && !bidsError && bids.length === 0 && (
                  <div className="text-xs text-nouns-dark-grey text-center py-4">
                    {nounId ? "No bids yet for this auction" : "No auction data available"}
                  </div>
                )}
                {bids.map((bid, idx) => (
                  <motion.div
                    key={bid.id || `bid-${idx}`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between py-2 border-b border-nouns-grey last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {bid.bidderDisplayName || "Unknown bidder"}
                      </p>
                      <p className="text-xs text-nouns-dark-grey">
                        {bid.formattedTime || "Unknown time"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-nouns-red">
                        {bid.formattedAmount || "0"} ETH
                      </p>
                      {idx === 0 && (
                        <span className="text-xs text-nouns-green">Highest Bid</span>
                      )}
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