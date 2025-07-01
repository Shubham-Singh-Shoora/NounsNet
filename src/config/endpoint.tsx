import React, { createContext, useContext, useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GRAPH_API_KEY
const SUBGRAPH_ID = import.meta.env.VITE_GRAPH_SUBGRAPH_ID
const API_URL = `https://gateway-arbitrum.network.thegraph.com/api/${API_KEY}/subgraphs/id/${SUBGRAPH_ID}`
// Default endpoints
const DEFAULTS = {
    ethRpc: "https://eth-mainnet.alchemyapi.io/v2/demo",
    graphApi: API_URL
};

type SettingsContextType = {
    ethRpc: string;
    graphApi: string;
    setEthRpc: (v: string) => void;
    setGraphApi: (v: string) => void;
};

const SettingsContext = createContext<SettingsContextType>({
    ...DEFAULTS,
    setEthRpc: () => { },
    setGraphApi: () => { },
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [ethRpc, setEthRpc_] = useState<string>(() => localStorage.getItem("ethRpc") || DEFAULTS.ethRpc);
    const [graphApi, setGraphApi_] = useState<string>(() => localStorage.getItem("graphApi") || DEFAULTS.graphApi);

    useEffect(() => { localStorage.setItem("ethRpc", ethRpc); }, [ethRpc]);
    useEffect(() => { localStorage.setItem("graphApi", graphApi); }, [graphApi]);

    return (
        <SettingsContext.Provider value={{
            ethRpc,
            graphApi,
            setEthRpc: setEthRpc_,
            setGraphApi: setGraphApi_,
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
