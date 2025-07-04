import { ethers } from "ethers";

const ETH_RPC = import.meta.env.VITE_ETH_RPC;

// Default fallback RPCs (can be overwritten by user settings)
export const getProvider = (customRpc?: string) => {
    const rpcUrl = customRpc || ETH_RPC || "https://eth-mainnet.alchemyapi.io/v2/demo";
    return new ethers.JsonRpcProvider(rpcUrl);
};

// Nouns Auction ABI fragment 
const AUCTION_ABI = [
    "function auction() view returns (uint256 nounId, uint256 amount, uint256 startTime, uint256 endTime, address bidder, bool settled)",
    "function settleCurrentAndCreateNewAuction()",
    "function createBid(uint256 nounId) payable",
];

// Nouns Governor ABI fragment
const GOVERNOR_ABI = [
    "function propose(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description) returns (uint256 proposalId)",
    "function castVote(uint256 proposalId, uint8 support) returns (uint256 weight)",
    "function castVoteWithReason(uint256 proposalId, uint8 support, string reason) returns (uint256 weight)",
    "function getVotes(address account, uint256 blockNumber) view returns (uint256)",
    "function hasVoted(uint256 proposalId, address account) view returns (bool)",
    "function proposalDeadline(uint256 proposalId) view returns (uint256)",
    "function proposalSnapshot(uint256 proposalId) view returns (uint256)",
    "function state(uint256 proposalId) view returns (uint8)",
    "function votingDelay() view returns (uint256)",
    "function votingPeriod() view returns (uint256)",
    "function proposalThreshold() view returns (uint256)"
];

// Nouns Token ABI fragment (for checking voting power)
const NOUNS_TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function getCurrentVotes(address account) view returns (uint256)",
    "function getPriorVotes(address account, uint256 blockNumber) view returns (uint256)"
];

// Contract addresses
export const AUCTION_ADDRESS = import.meta.env.VITE_NOUNS_AUCTION_ADDRESS || "0x830BD73E4184ceF73443C15111a1DF14e495C706";
export const GOVERNOR_ADDRESS = import.meta.env.VITE_NOUNS_GOVERNOR_ADDRESS || "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d";
export const NOUNS_TOKEN_ADDRESS = import.meta.env.VITE_NOUNS_TOKEN_ADDRESS || "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03";

export function getAuctionContract(providerOrSigner: ethers.Provider | ethers.Signer) {
    if (!AUCTION_ADDRESS) {
        throw new Error("Auction contract address not configured");
    }
    return new ethers.Contract(AUCTION_ADDRESS, AUCTION_ABI, providerOrSigner);
}

export function getGovernorContract(providerOrSigner: ethers.Provider | ethers.Signer) {
    if (!GOVERNOR_ADDRESS) {
        throw new Error("Governor contract address not configured");
    }
    return new ethers.Contract(GOVERNOR_ADDRESS, GOVERNOR_ABI, providerOrSigner);
}

export function getNounsTokenContract(providerOrSigner: ethers.Provider | ethers.Signer) {
    if (!NOUNS_TOKEN_ADDRESS) {
        throw new Error("Nouns token contract address not configured");
    }
    return new ethers.Contract(NOUNS_TOKEN_ADDRESS, NOUNS_TOKEN_ABI, providerOrSigner);
}

// Helper function to get a signer from MetaMask
export async function getSigner() {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
}

// Helper function to get user's voting power
export async function getVotingPower(userAddress: string, blockNumber?: number): Promise<number> {
    try {
        const provider = getProvider();
        const nounsToken = getNounsTokenContract(provider);

        let votes: bigint;
        if (blockNumber) {
            votes = await nounsToken.getPriorVotes(userAddress, blockNumber);
        } else {
            votes = await nounsToken.getCurrentVotes(userAddress);
        }

        return Number(votes);
    } catch (error) {
        console.error('Error getting voting power:', error);
        return 0;
    }
}

// Helper function to check if user has voted on a proposal
export async function hasUserVoted(proposalId: string, userAddress: string): Promise<boolean> {
    try {
        const provider = getProvider();
        const governor = getGovernorContract(provider);
        return await governor.hasVoted(proposalId, userAddress);
    } catch (error) {
        console.error('Error checking if user has voted:', error);
        return false;
    }
}