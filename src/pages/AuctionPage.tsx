import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, DollarSign, Gavel } from 'lucide-react';
import { useNounTraits } from '../hooks/useNounTraits';
import { useAuctionBids } from '../hooks/useAuctionBids';
import { useNounData } from '../hooks/useNounData';

// These arrays should be filled with the real Nouns trait names
const backgrounds = ["Cool", "Warm", "Sunny", "Blue", "Purple"];
const bodies = ["Red", "Blue", "Green", "Yellow", "Orange"];
const accessories = ["None", "Glasses", "Hat", "Tie", "Scarf"];
const heads = ["Crown", "Cap", "Helmet", "Bandana", "Beanie"];
const glasses = ["None", "Sunglasses", "Monocle", "VR", "3D"];

function mapTrait(arr: string[], id: string | number | undefined) {
  if (typeof id === "undefined" || id === null) return "—";
  const idx = Number(id);
  return arr[idx] ?? `#${idx}`;
}

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

// Better image URL construction with fallbacks
const getNounImageUrls = (nounId: string | undefined): string[] => {
  if (!nounId) return ['/noun-removebg-preview.png'];

  // Multiple fallback URLs for Noun images
  return [
    `https://nouns.wtf/api/v0-seeder/seed/${nounId}/render`,
    `https://noun-api.com/beta/pfp/${nounId}`,
    // Fallback to local image
    'src\assets\noun-removebg-preview.png'
  ];
};

// Component for handling multiple image fallbacks
const NounImage = ({ nounId, className }: { nounId: string | undefined, className: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const imageUrls = getNounImageUrls(nounId);

  const handleImageError = () => {
    console.log(`Failed to load image ${currentImageIndex}: ${imageUrls[currentImageIndex]}`);
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setImageError(false); // Reset error state when trying next image
    } else {
      setImageError(true);
      console.log('All image URLs failed to load');
    }
  };

  const handleImageLoad = () => {
    console.log(`Successfully loaded image: ${imageUrls[currentImageIndex]}`);
    setImageError(false);
  };

  // Reset image index when nounId changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(false);
  }, [nounId]);

  return (
    <img
      src={imageUrls[currentImageIndex]}
      alt={`Noun ${nounId || 'Unknown'}`}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      style={{
        filter: imageError ? 'grayscale(100%)' : 'none',
        opacity: imageError ? 0.5 : 1
      }}
    />
  );
};

const AuctionPage = () => {
  const { auction, loading: auctionLoading, error: auctionError } = useNounData();
  const nounId = auction?.nounId?.toString();
  const { traits, loading: traitsLoading } = useNounTraits(nounId);
  const { bids, loading: bidsLoading, error: bidsError } = useAuctionBids(nounId);

  // Timer
  const endTime = auction?.endTime ? Number(auction.endTime) : undefined;
  const { hours, minutes, seconds } = useCountdown(endTime);

  // Current bid is highest bid or from auction data
  const currentBid = bids.length > 0
    ? Number(bids[0].amount) / 1e18
    : auction?.amount
      ? Number(auction.amount) / 1e18
      : 0;

  // Debug logging
  useEffect(() => {
    console.log('=== AUCTION DEBUG INFO ===');
    console.log('Auction data:', auction);
    console.log('Noun ID:', nounId);
    console.log('Traits data:', traits);
    console.log('Bids data:', bids);
    console.log('Current bid:', currentBid);
    console.log('Errors:', { auctionError, bidsError });
    console.log('Loading states:', { auctionLoading, traitsLoading, bidsLoading });
  }, [auction, nounId, traits, bids, currentBid, auctionError, bidsError, auctionLoading, traitsLoading, bidsLoading]);

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
                <h2 className="font-pixel text-lg mb-2">
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
              <div className="bg-gradient-to-br from-nouns-blue to-nouns-green rounded-2xl p-8">
                <NounImage
                  nounId={nounId}
                  className="w-full h-64 object-contain animate-float"
                />
              </div>
            </div>

            {/* Noun Traits */}
            <div className="bg-nouns-grey rounded-2xl p-6">
              <h3 className="font-pixel text-sm mb-4">TRAITS</h3>
              <div className="grid grid-cols-2 gap-4">
                {traits ? (
                  <>
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-xs text-nouns-dark-grey">BACKGROUND</span>
                      <p className="font-medium">{mapTrait(backgrounds, traits.background)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-xs text-nouns-dark-grey">BODY</span>
                      <p className="font-medium">{mapTrait(bodies, traits.body)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-xs text-nouns-dark-grey">ACCESSORY</span>
                      <p className="font-medium">{mapTrait(accessories, traits.accessory)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-xs text-nouns-dark-grey">HEAD</span>
                      <p className="font-medium">{mapTrait(heads, traits.head)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-xs text-nouns-dark-grey">GLASSES</span>
                      <p className="font-medium">{mapTrait(glasses, traits.glasses)}</p>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 text-center text-xs text-nouns-dark-grey">
                    {traitsLoading ? "Loading traits..." :
                      !nounId ? "No noun selected" :
                        !traits ? "No trait data available" :
                          "Traits data loaded"}
                  </div>
                )}
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
                  {(bids.length > 0 && bids[0]?.bidder)
                    ? `Top Bidder: ${bids[0].bidder.slice(0, 6)}...${bids[0].bidder.slice(-4)}`
                    : auction?.bidder && auction.bidder !== "0x0000000000000000000000000000000000000000"
                      ? `Current Bidder: ${auction.bidder.slice(0, 6)}...${auction.bidder.slice(-4)}`
                      : "No bidders yet"}
                </p>
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
                    step="0.01"
                    min={currentBid + 0.01}
                    disabled // Enable and wire up wallet for real bidding
                  />
                  <span className="font-medium text-nouns-dark-grey">ETH</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-nouns-red text-white py-4 rounded-lg font-pixel text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 opacity-60 cursor-not-allowed"
                  disabled
                  title="Connect wallet to place bid"
                >
                  <Gavel size={16} />
                  <span>PLACE BID</span>
                </motion.button>
                <div className="text-xs text-nouns-dark-grey text-center">
                  Bidding requires wallet connection and sufficient ETH.
                  <br />
                  Minimum bid: {currentBid > 0 ? `${(currentBid + 0.01).toFixed(2)} ETH` : "0.01 ETH"}
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
                        {bid.bidder ? `${bid.bidder.slice(0, 6)}...${bid.bidder.slice(-4)}` : "Unknown bidder"}
                      </p>
                      <p className="text-xs text-nouns-dark-grey">
                        {bid.blockTimestamp
                          ? new Date(Number(bid.blockTimestamp) * 1000).toLocaleString()
                          : "Unknown time"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-nouns-red">
                        {bid.amount ? (Number(bid.amount) / 1e18).toFixed(3) : "0"} ETH
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