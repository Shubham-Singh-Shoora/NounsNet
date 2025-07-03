import { useEffect, useState } from "react";
import { graphQuery } from "../lib/graph";
import { useSettings } from "../config/endpoint";

const BID_HISTORY_QUERY = `
  query AuctionBids($nounId: String!) {
    auction(id: $nounId) {
      id
      bids(orderBy: amount, orderDirection: desc, first: 20) {
        id
        bidder {
          id
          tokenBalance
        }
        amount
        blockTimestamp
        blockNumber
        txIndex
      }
    }
  }
`;

// Function to get a display name for a bidder
const getBidderDisplayName = (bidderAddress: string, bidderData?: any): string => {
  if (!bidderAddress) return "Unknown bidder";

  // Check if this is a known address (expand this list with well-known Nouns community addresses)
  const knownAddresses: Record<string, string> = {
    "0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5": "nounders.eth",
    "0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71": "nouns.wtf",
    "0x0BC3807Ec262cB779b38D65b38158acC3bfede10": "Nounders Multisig",
    "0x830BD73E4184ceF73443C15111a1DF14e495C706": "Nouns Foundation",
    "0x40d1141740d1c1b8E7b8B1A8C2c3c2b3F2D3e4f5": "Nouns Treasury",
    // Add more known addresses as needed
  };

  if (knownAddresses[bidderAddress]) {
    return knownAddresses[bidderAddress];
  }

  // Check if bidder has Nouns (from tokenBalance)
  if (bidderData?.tokenBalance && Number(bidderData.tokenBalance) > 0) {
    const nounCount = Number(bidderData.tokenBalance);
    return nounCount === 1
      ? "Noun Holder (1 Noun)"
      : `Noun Holder (${nounCount} Nouns)`;
  }

  // For unknown addresses, show shortened version
  return `${bidderAddress.slice(0, 6)}...${bidderAddress.slice(-4)}`;
};

export function useAuctionBids(nounId: string | number | undefined) {
  const { graphApi } = useSettings();
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nounId) {
      setBids([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    graphQuery(BID_HISTORY_QUERY, { nounId: nounId.toString() }, graphApi)
      .then((data) => {
        const auctionBids = data.auction?.bids ?? [];

        // Process bids to add display names
        const processedBids = auctionBids.map((bid: any) => ({
          ...bid,
          bidderAddress: bid.bidder?.id || bid.bidder,
          bidderDisplayName: getBidderDisplayName(bid.bidder?.id || bid.bidder, bid.bidder),
          formattedAmount: bid.amount ? (Number(bid.amount) / 1e18).toFixed(3) : "0",
          formattedTime: bid.blockTimestamp
            ? new Date(Number(bid.blockTimestamp) * 1000).toLocaleString()
            : "Unknown time"
        }));

        setBids(processedBids);
      })
      .catch((e) => {
        console.error("Error fetching bids:", e);
        setError(e.message || "Failed to fetch bids");
      })
      .finally(() => setLoading(false));
  }, [nounId, graphApi]);

  return { bids, loading, error };
}