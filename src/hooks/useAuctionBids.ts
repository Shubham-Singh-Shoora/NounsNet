import { useEffect, useState } from "react";
import { graphQuery } from "../lib/graph";
import { useSettings } from "../config/endpoint";

const BID_HISTORY_QUERY = `
  query AuctionBids($nounId: Int!) {
    auction(id: $nounId) {
      id
      bids(orderBy: amount, orderDirection: desc) {
        id
        bidder
        amount
        blockTimestamp
      }
    }
  }
`;

export function useAuctionBids(nounId: string | number | undefined) {
  const { graphApi } = useSettings();
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nounId) return;
    setLoading(true);
    setError(null);
    graphQuery(BID_HISTORY_QUERY, { nounId: Number(nounId) }, graphApi)
      .then((data) => setBids(data.auction?.bids ?? []))
      .catch((e) => setError(e.message || "Failed to fetch bids"))
      .finally(() => setLoading(false));
  }, [nounId, graphApi]);

  return { bids, loading, error };
}