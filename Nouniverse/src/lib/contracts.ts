import { ethers } from 'ethers';
import { getAuctionContract, getGovernorContract, getNounsTokenContract, getSigner, getVotingPower } from './ether';

// Bidding functionality
export async function placeBid(nounId: string, bidAmount: string): Promise<string> {
    try {
        const signer = await getSigner();
        const auctionContract = getAuctionContract(signer);

        const bidValue = ethers.parseEther(bidAmount);

        const tx = await auctionContract.createBid(nounId, {
            value: bidValue,
            gasLimit: 150000
        });

        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error('Error placing bid:', error);
        throw error;
    }
}

// Voting functionality
export async function castVote(proposalId: string, support: 0 | 1 | 2, reason?: string): Promise<string> {
    try {
        const signer = await getSigner();
        const governorContract = getGovernorContract(signer);

        let tx;
        if (reason && reason.trim()) {
            tx = await governorContract.castVoteWithReason(proposalId, support, reason, {
                gasLimit: 200000
            });
        } else {
            tx = await governorContract.castVote(proposalId, support, {
                gasLimit: 150000
            });
        }

        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error('Error casting vote:', error);
        throw error;
    }
}

// Proposal creation functionality
export async function createProposal(
    targets: string[],
    values: string[],
    signatures: string[],
    calldatas: string[],
    description: string
): Promise<string> {
    try {
        const signer = await getSigner();
        const governorContract = getGovernorContract(signer);

        // Check if user has enough voting power to create proposal
        const userAddress = await signer.getAddress();
        const votingPower = await getVotingPower(userAddress);

        if (votingPower === 0) {
            throw new Error('You need to own at least one Noun to create a proposal');
        }

        const tx = await governorContract.propose(
            targets,
            values,
            signatures,
            calldatas,
            description,
            {
                gasLimit: 300000
            }
        );

        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error('Error creating proposal:', error);
        throw error;
    }
}

// Check if user has voting power
export async function checkVotingPower(userAddress: string): Promise<number> {
    try {
        return await getVotingPower(userAddress);
    } catch (error) {
        console.error('Error checking voting power:', error);
        return 0;
    }
}

// Get user's Nouns tokens
export async function getUserNouns(userAddress: string): Promise<number[]> {
    try {
        if (!window.ethereum) {
            throw new Error('MetaMask not available');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const nounsToken = getNounsTokenContract(provider);

        const balance = await nounsToken.balanceOf(userAddress);
        const nouns: number[] = [];

        for (let i = 0; i < Number(balance); i++) {
            const tokenId = await nounsToken.tokenOfOwnerByIndex(userAddress, i);
            nouns.push(Number(tokenId));
        }

        return nouns;
    } catch (error) {
        console.error('Error getting user nouns:', error);
        return [];
    }
}

// Check if user has voted on a proposal
export async function checkIfVoted(proposalId: string, userAddress: string): Promise<boolean> {
    try {
        if (!window.ethereum) {
            throw new Error('MetaMask not available');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const governorContract = getGovernorContract(provider);

        return await governorContract.hasVoted(proposalId, userAddress);
    } catch (error) {
        console.error('Error checking if voted:', error);
        return false;
    }
}
