import { ethers } from "ethers";

const ETH_RPC = import.meta.env.VITE_ETH_RPC;
// Default fallback RPCs (can be overwritten by user settings)
export const getProvider = (customRpc?: string) => {
    return new ethers.JsonRpcProvider(
        customRpc || ETH_RPC
    );
};

// Nouns Auction ABI fragment 
const AUCTION_ABI = [
    "function auction() view returns (uint256 nounId, uint256 amount, uint256 startTime, uint256 endTime, address bidder, bool settled)",
    "function settleCurrentAndCreateNewAuction()",
    "function createBid(uint256 nounId) payable",
];

// Mainnet Nouns Auction contract address
export const AUCTION_ADDRESS = import.meta.env.VITE_NOUNS_AUCTION_ADDRESS

export function getAuctionContract(provider: ethers.Provider) {
    return new ethers.Contract(AUCTION_ADDRESS, AUCTION_ABI, provider);
}