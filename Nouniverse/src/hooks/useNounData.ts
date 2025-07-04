import { useEffect, useState } from "react";
import { getProvider, getAuctionContract } from "../lib/ether";
import { useSettings } from "../config/endpoint";

export function useNounData() {
    const { ethRpc } = useSettings();
    const [auction, setAuction] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const provider = getProvider(ethRpc);
        const contract = getAuctionContract(provider);

        contract.auction()
            .then(setAuction)
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));

    }, [ethRpc]);

    return { auction, loading, error };
}