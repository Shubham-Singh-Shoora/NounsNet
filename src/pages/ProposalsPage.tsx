import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Clock, CheckCircle, XCircle, Users, Plus, X, AlertCircle, Loader } from "lucide-react";
import { useProposals } from "../hooks/useGraph";
import { useSettings } from "../config/endpoint";

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

interface ProposalAction {
  target: string;
  value: string;
  signature: string;
  calldata: string;
  description: string;
}

interface CreateProposalData {
  title: string;
  description: string;
  actions: ProposalAction[];
}

// Nouns DAO contract addresses and ABIs (for future implementation)
// const NOUNS_DAO_PROXY = "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d";
// const NOUNS_TOKEN = "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03";

// Simplified ABI for the functions we need (for future implementation)
// const NOUNS_DAO_ABI = [
//   "function propose(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description) returns (uint256)",
//   "function castVote(uint256 proposalId, uint8 support) returns (uint256)",
//   "function castVoteWithReason(uint256 proposalId, uint8 support, string reason) returns (uint256)",
//   "function getVotes(address account, uint256 blockNumber) view returns (uint256)",
//   "function hasVoted(uint256 proposalId, address account) view returns (bool)"
// ];

// Helper: format votes (assuming 18 decimals as with NounsDAO proposals)
function formatVotes(x: string | number) {
  return (typeof x === "string" ? parseFloat(x) : x / 1e18).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// Status helpers
function getStatusColor(state: string) {
  switch (state) {
    case "ACTIVE": return "text-nouns-blue bg-blue-50";
    case "SUCCEEDED":
    case "EXECUTED":
    case "QUEUED": return "text-nouns-green bg-green-50";
    case "CANCELED":
    case "DEFEATED":
    case "EXPIRED": return "text-nouns-red bg-red-50";
    default: return "text-nouns-dark-grey bg-nouns-grey";
  }
}

function getStatusIcon(state: string) {
  switch (state) {
    case "ACTIVE": return <Clock size={16} />;
    case "SUCCEEDED":
    case "EXECUTED":
    case "QUEUED": return <CheckCircle size={16} />;
    case "CANCELED":
    case "DEFEATED":
    case "EXPIRED": return <XCircle size={16} />;
    default: return <Vote size={16} />;
  }
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "active",
  SUCCEEDED: "passed",
  EXECUTED: "passed",
  QUEUED: "passed",
  CANCELED: "failed",
  DEFEATED: "failed",
  EXPIRED: "failed",
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Passed", value: "passed" },
  { label: "Failed", value: "failed" },
];

// Fetch current block (Ethereum mainnet or configured)
async function fetchCurrentBlock(rpc: string): Promise<number> {
  const resp = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_blockNumber",
      params: [],
    }),
  });
  const { result } = await resp.json();
  return parseInt(result, 16);
}

// Calculate time left for proposal (based on current block and endBlock)
function getTimeLeft(currentBlock: number, endBlock?: number) {
  if (!endBlock || !currentBlock) return "—";
  const blocksLeft = endBlock - currentBlock;
  const secondsLeft = blocksLeft * 12;
  if (secondsLeft <= 0) return "Ended";
  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function ProposalsPage() {
  const [filter, setFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [voteSupport, setVoteSupport] = useState<0 | 1 | 2>(1); // 0: Against, 1: For, 2: Abstain
  const [voteReason, setVoteReason] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');

  const { proposals, loading, error } = useProposals(30);
  const { ethRpc } = useSettings();
  const [currentBlock, setCurrentBlock] = useState<number>(0);

  // Wallet state - get from localStorage (persisted from SettingsPage)
  const [walletData, setWalletData] = useState<WalletData>({
    address: '',
    isConnected: false,
    balance: '0.00',
    nounsOwned: []
  });

  // Create proposal form state
  const [createProposalData, setCreateProposalData] = useState<CreateProposalData>({
    title: '',
    description: '',
    actions: [{
      target: '',
      value: '0',
      signature: '',
      calldata: '0x',
      description: ''
    }]
  });

  // Get endBlock from proposal if present
  function getEndBlock(p: any) {
    return typeof p.endBlock !== "undefined" ? Number(p.endBlock) : undefined;
  }

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

  // Poll for block number every 5s and update local block every 12s for smooth UI
  useEffect(() => {
    let mounted = true;
    fetchCurrentBlock(ethRpc).then((b) => mounted && setCurrentBlock(b));
    const poll = setInterval(() => fetchCurrentBlock(ethRpc).then((b) => mounted && setCurrentBlock(b)), 5000);
    const tick = setInterval(() => setCurrentBlock((b) => (b > 0 ? b + 1 : b)), 12000);
    return () => {
      mounted = false;
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [ethRpc]);

  // Filter proposals - Fixed filtering logic
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      if (filter === "all") return true;
      if (filter === "ACTIVE") return p.status === "ACTIVE";
      if (filter === "passed") return ["SUCCEEDED", "EXECUTED", "QUEUED"].includes(p.status);
      if (filter === "failed") return ["CANCELED", "DEFEATED", "EXPIRED"].includes(p.status);
      return true;
    });
  }, [proposals, filter]);

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        }) as string[];

        if (accounts.length === 0) {
          alert('No accounts found. Please make sure MetaMask is unlocked.');
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
      } catch (error: any) {
        console.error('Failed to connect wallet:', error);
        alert(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask from https://metamask.io/');
    }
  };

  // Add action to proposal
  const addAction = () => {
    setCreateProposalData({
      ...createProposalData,
      actions: [...createProposalData.actions, {
        target: '',
        value: '0',
        signature: '',
        calldata: '0x',
        description: ''
      }]
    });
  };

  // Remove action from proposal
  const removeAction = (index: number) => {
    const newActions = createProposalData.actions.filter((_, i) => i !== index);
    setCreateProposalData({
      ...createProposalData,
      actions: newActions.length > 0 ? newActions : [{
        target: '',
        value: '0',
        signature: '',
        calldata: '0x',
        description: ''
      }]
    });
  };

  // Update action
  const updateAction = (index: number, field: keyof ProposalAction, value: string) => {
    const newActions = [...createProposalData.actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setCreateProposalData({ ...createProposalData, actions: newActions });
  };

  // Create proposal
  const createProposal = async () => {
    if (!walletData.isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!createProposalData.title.trim() || !createProposalData.description.trim()) {
      alert('Please fill in title and description');
      return;
    }

    // Validate actions
    const validActions = createProposalData.actions.filter(action =>
      action.target.trim() && action.description.trim()
    );

    if (validActions.length === 0) {
      alert('Please add at least one valid action');
      return;
    }

    setIsCreatingProposal(true);
    setTransactionStatus('pending');

    try {
      // Prepare contract call data
      const targets = validActions.map(action => action.target);
      const values = validActions.map(action => action.value || '0');
      const signatures = validActions.map(action => action.signature || '');
      const calldatas = validActions.map(action => action.calldata || '0x');

      // Create description with actions
      const fullDescription = `# ${createProposalData.title}\n\n${createProposalData.description}\n\n## Actions:\n${validActions.map((action, i) => `${i + 1}. ${action.description}`).join('\n')}`;

      // Log the proposal data for debugging (in real implementation, this would be sent to contract)
      console.log('Creating proposal with data:', {
        targets,
        values,
        signatures,
        calldatas,
        description: fullDescription
      });

      // Here you would encode the function call and send the transaction
      // For demo purposes, we'll simulate a successful transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      setTransactionHash(mockTxHash);
      setTransactionStatus('success');

      // Reset form
      setTimeout(() => {
        setCreateProposalData({
          title: '',
          description: '',
          actions: [{
            target: '',
            value: '0',
            signature: '',
            calldata: '0x',
            description: ''
          }]
        });
        setShowCreateModal(false);
        setTransactionStatus('idle');
      }, 3000);

    } catch (error: any) {
      console.error('Error creating proposal:', error);
      setTransactionStatus('error');
      alert(`Failed to create proposal: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCreatingProposal(false);
    }
  };

  // Cast vote
  const castVote = async () => {
    if (!walletData.isConnected || !selectedProposal) {
      alert('Please connect your wallet first');
      return;
    }

    setIsVoting(true);
    setTransactionStatus('pending');

    try {
      // Here you would call the contract's castVote or castVoteWithReason function
      // For demo purposes, we'll simulate a successful vote
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      setTransactionHash(mockTxHash);
      setTransactionStatus('success');

      setTimeout(() => {
        setShowVoteModal(false);
        setVoteReason('');
        setTransactionStatus('idle');
        setSelectedProposal(null);
      }, 3000);

    } catch (error: any) {
      console.error('Error casting vote:', error);
      setTransactionStatus('error');
      alert(`Failed to cast vote: ${error.message || 'Unknown error'}`);
    } finally {
      setIsVoting(false);
    }
  };

  const openVoteModal = (proposal: any) => {
    setSelectedProposal(proposal);
    setShowVoteModal(true);
    setTransactionStatus('idle');
  };

  const openCreateModal = () => {
    if (!walletData.isConnected) {
      connectWallet();
      return;
    }
    setShowCreateModal(true);
    setTransactionStatus('idle');
  };

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
            THE FORUM OF <span className="text-nouns-blue">IDEAS</span>
          </h1>
          <p className="text-xl text-nouns-dark-grey">
            Shape the future through collective decision-making
          </p>
          {walletData.isConnected && (
            <div className="mt-4 text-sm text-nouns-dark-grey">
              Connected: {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)} |
              Nouns Owned: {walletData.nounsOwned.length}
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-6 py-3 rounded-xl font-pixel text-xs transition-all duration-200 ${filter === value
                  ? "bg-nouns-red text-white"
                  : "text-nouns-dark-grey hover:text-nouns-text hover:bg-nouns-grey"
                  }`}
              >
                {label.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Proposals Grid */}
        <div className="space-y-6">
          {loading && <div className="text-center text-nouns-dark-grey py-12">Loading proposals...</div>}
          {error && <div className="text-center text-red-500 py-12">{error}</div>}
          {!loading && !error && filteredProposals.length === 0 && (
            <div className="text-center text-nouns-dark-grey py-12">No proposals found.</div>
          )}
          {filteredProposals.map((proposal, index) => (
            <motion.div
              key={proposal.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-pixel flex items-center space-x-1 ${getStatusColor(
                        proposal.status
                      )}`}
                    >
                      {getStatusIcon(proposal.status)}
                      <span>
                        {STATUS_LABELS[proposal.status]
                          ? STATUS_LABELS[proposal.status].toUpperCase()
                          : proposal.status.toUpperCase()}
                      </span>
                    </span>
                    <span className="text-xs text-nouns-dark-grey">
                      by {proposal.proposer?.id?.slice(0, 6)}...{proposal.proposer?.id?.slice(-4)}
                    </span>
                  </div>
                  <h3 className="font-londrina text-2xl font-bold mb-2">{proposal.title}</h3>
                  <p className="text-nouns-dark-grey leading-relaxed">{proposal.description}</p>
                </div>
                <div className="text-right ml-6">
                  <div className="text-sm text-nouns-dark-grey mb-1">
                    {proposal.status === "ACTIVE" && currentBlock
                      ? getTimeLeft(currentBlock, getEndBlock(proposal))
                      : proposal.status === "ACTIVE"
                        ? "—"
                        : "Ended"}
                  </div>
                  <div className="font-pixel text-xs text-nouns-red">#{proposal.id}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Votes For */}
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-pixel text-nouns-green">FOR</span>
                    <CheckCircle className="text-nouns-green" size={16} />
                  </div>
                  <div className="font-londrina text-2xl font-bold text-nouns-green">{formatVotes(proposal.forVotes)}</div>
                </div>

                {/* Votes Against */}
                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-pixel text-nouns-red">AGAINST</span>
                    <XCircle className="text-nouns-red" size={16} />
                  </div>
                  <div className="font-londrina text-2xl font-bold text-nouns-red">
                    {formatVotes(proposal.againstVotes)}
                  </div>
                </div>

                {/* Vote Button */}
                <div className="flex items-center">
                  {proposal.status === "ACTIVE" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-nouns-blue text-white py-3 rounded-xl font-pixel text-xs hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      onClick={() => walletData.isConnected ? openVoteModal(proposal) : connectWallet()}
                    >
                      <Vote size={16} />
                      <span>{walletData.isConnected ? 'VOTE' : 'CONNECT TO VOTE'}</span>
                    </motion.button>
                  ) : (
                    <div className="w-full bg-nouns-grey text-nouns-dark-grey py-3 rounded-xl font-pixel text-xs text-center">
                      VOTING ENDED
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Proposal Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-nouns-red text-white px-8 py-4 rounded-xl font-pixel text-sm hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
            onClick={openCreateModal}
          >
            <Plus size={16} />
            <span>{walletData.isConnected ? 'CREATE PROPOSAL' : 'CONNECT TO CREATE'}</span>
          </motion.button>
        </motion.div>

        {/* Create Proposal Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => !isCreatingProposal && setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-londrina text-3xl font-bold">CREATE PROPOSAL</h2>
                  {!isCreatingProposal && (
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="text-nouns-dark-grey hover:text-nouns-text"
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>

                {transactionStatus === 'success' ? (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto mb-4 text-nouns-green" size={64} />
                    <h3 className="font-londrina text-2xl font-bold mb-2">Proposal Created!</h3>
                    <p className="text-nouns-dark-grey mb-4">Your proposal has been submitted successfully.</p>
                    {transactionHash && (
                      <p className="text-sm text-nouns-dark-grey font-mono">
                        Transaction: {transactionHash.slice(0, 10)}...{transactionHash.slice(-10)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-pixel mb-2">PROPOSAL TITLE</label>
                      <input
                        type="text"
                        value={createProposalData.title}
                        onChange={(e) => setCreateProposalData({ ...createProposalData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                        placeholder="Enter proposal title"
                        disabled={isCreatingProposal}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-pixel mb-2">DESCRIPTION</label>
                      <textarea
                        rows={4}
                        value={createProposalData.description}
                        onChange={(e) => setCreateProposalData({ ...createProposalData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                        placeholder="Describe your proposal in detail..."
                        disabled={isCreatingProposal}
                      />
                    </div>

                    {/* Actions */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-pixel">PROPOSAL ACTIONS</label>
                        <button
                          onClick={addAction}
                          className="flex items-center space-x-1 text-nouns-red hover:text-nouns-blue transition-colors"
                          disabled={isCreatingProposal}
                        >
                          <Plus size={16} />
                          <span className="text-xs font-pixel">ADD ACTION</span>
                        </button>
                      </div>

                      {createProposalData.actions.map((action, index) => (
                        <div key={index} className="border border-nouns-grey rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-pixel text-xs">ACTION {index + 1}</h4>
                            {createProposalData.actions.length > 1 && (
                              <button
                                onClick={() => removeAction(index)}
                                className="text-red-500 hover:text-red-600"
                                disabled={isCreatingProposal}
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-pixel mb-1">TARGET CONTRACT</label>
                              <input
                                type="text"
                                value={action.target}
                                onChange={(e) => updateAction(index, 'target', e.target.value)}
                                className="w-full px-3 py-2 border border-nouns-grey rounded focus:outline-none focus:ring-1 focus:ring-nouns-red text-sm"
                                placeholder="0x..."
                                disabled={isCreatingProposal}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-pixel mb-1">VALUE (ETH)</label>
                              <input
                                type="text"
                                value={action.value}
                                onChange={(e) => updateAction(index, 'value', e.target.value)}
                                className="w-full px-3 py-2 border border-nouns-grey rounded focus:outline-none focus:ring-1 focus:ring-nouns-red text-sm"
                                placeholder="0"
                                disabled={isCreatingProposal}
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-pixel mb-1">FUNCTION SIGNATURE</label>
                              <input
                                type="text"
                                value={action.signature}
                                onChange={(e) => updateAction(index, 'signature', e.target.value)}
                                className="w-full px-3 py-2 border border-nouns-grey rounded focus:outline-none focus:ring-1 focus:ring-nouns-red text-sm"
                                placeholder="transfer(address,uint256)"
                                disabled={isCreatingProposal}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-pixel mb-1">CALLDATA</label>
                              <input
                                type="text"
                                value={action.calldata}
                                onChange={(e) => updateAction(index, 'calldata', e.target.value)}
                                className="w-full px-3 py-2 border border-nouns-grey rounded focus:outline-none focus:ring-1 focus:ring-nouns-red text-sm"
                                placeholder="0x..."
                                disabled={isCreatingProposal}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-pixel mb-1">ACTION DESCRIPTION</label>
                            <input
                              type="text"
                              value={action.description}
                              onChange={(e) => updateAction(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-nouns-grey rounded focus:outline-none focus:ring-1 focus:ring-nouns-red text-sm"
                              placeholder="Describe what this action does"
                              disabled={isCreatingProposal}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Transaction Status */}
                    {transactionStatus === 'pending' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Loader className="animate-spin text-blue-500" size={20} />
                          <span className="text-blue-800 font-pixel text-xs">Creating proposal...</span>
                        </div>
                      </div>
                    )}

                    {transactionStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="text-red-500" size={20} />
                          <span className="text-red-800 font-pixel text-xs">Failed to create proposal</span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowCreateModal(false)}
                        className="px-6 py-3 border border-nouns-grey rounded-lg font-pixel text-xs text-nouns-dark-grey hover:text-nouns-text transition-colors"
                        disabled={isCreatingProposal}
                      >
                        CANCEL
                      </button>
                      <motion.button
                        whileHover={{ scale: isCreatingProposal ? 1 : 1.05 }}
                        whileTap={{ scale: isCreatingProposal ? 1 : 0.95 }}
                        onClick={createProposal}
                        disabled={isCreatingProposal}
                        className={`px-6 py-3 rounded-lg font-pixel text-xs transition-all duration-200 flex items-center space-x-2 ${isCreatingProposal
                            ? 'bg-nouns-dark-grey text-white cursor-not-allowed'
                            : 'bg-nouns-red text-white hover:shadow-lg'
                          }`}
                      >
                        {isCreatingProposal && <Loader className="animate-spin" size={16} />}
                        <span>{isCreatingProposal ? 'CREATING...' : 'CREATE PROPOSAL'}</span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vote Modal */}
        <AnimatePresence>
          {showVoteModal && selectedProposal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => !isVoting && setShowVoteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-londrina text-3xl font-bold">CAST YOUR VOTE</h2>
                  {!isVoting && (
                    <button
                      onClick={() => setShowVoteModal(false)}
                      className="text-nouns-dark-grey hover:text-nouns-text"
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>

                {transactionStatus === 'success' ? (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto mb-4 text-nouns-green" size={64} />
                    <h3 className="font-londrina text-2xl font-bold mb-2">Vote Cast!</h3>
                    <p className="text-nouns-dark-grey mb-4">Your vote has been recorded successfully.</p>
                    {transactionHash && (
                      <p className="text-sm text-nouns-dark-grey font-mono">
                        Transaction: {transactionHash.slice(0, 10)}...{transactionHash.slice(-10)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Proposal Info */}
                    <div className="bg-nouns-grey rounded-lg p-4">
                      <h3 className="font-londrina text-xl font-bold mb-2">{selectedProposal.title}</h3>
                      <p className="text-sm text-nouns-dark-grey">Proposal #{selectedProposal.id}</p>
                    </div>

                    {/* Vote Options */}
                    <div>
                      <label className="block text-sm font-pixel mb-4">SELECT YOUR VOTE</label>
                      <div className="space-y-3">
                        {[
                          { value: 1, label: 'FOR', color: 'nouns-green', icon: CheckCircle },
                          { value: 0, label: 'AGAINST', color: 'nouns-red', icon: XCircle },
                          { value: 2, label: 'ABSTAIN', color: 'nouns-dark-grey', icon: Vote }
                        ].map(({ value, label, color, icon: Icon }) => (
                          <label
                            key={value}
                            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${voteSupport === value
                                ? `border-${color} bg-${color} bg-opacity-10`
                                : 'border-nouns-grey hover:border-nouns-dark-grey'
                              }`}
                          >
                            <input
                              type="radio"
                              name="vote"
                              value={value}
                              checked={voteSupport === value}
                              onChange={(e) => setVoteSupport(Number(e.target.value) as 0 | 1 | 2)}
                              className="sr-only"
                              disabled={isVoting}
                            />
                            <Icon className={`text-${color}`} size={20} />
                            <span className="font-pixel text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Vote Reason */}
                    <div>
                      <label className="block text-sm font-pixel mb-2">VOTING REASON (OPTIONAL)</label>
                      <textarea
                        rows={3}
                        value={voteReason}
                        onChange={(e) => setVoteReason(e.target.value)}
                        className="w-full px-4 py-3 border border-nouns-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-nouns-red"
                        placeholder="Explain your vote (will be recorded on-chain)"
                        disabled={isVoting}
                      />
                    </div>

                    {/* Voting Power */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="text-blue-500" size={20} />
                        <span className="text-blue-800 font-pixel text-xs">
                          Your voting power: {walletData.nounsOwned.length} votes
                        </span>
                      </div>
                    </div>

                    {/* Transaction Status */}
                    {transactionStatus === 'pending' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Loader className="animate-spin text-blue-500" size={20} />
                          <span className="text-blue-800 font-pixel text-xs">Casting vote...</span>
                        </div>
                      </div>
                    )}

                    {transactionStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="text-red-500" size={20} />
                          <span className="text-red-800 font-pixel text-xs">Failed to cast vote</span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowVoteModal(false)}
                        className="px-6 py-3 border border-nouns-grey rounded-lg font-pixel text-xs text-nouns-dark-grey hover:text-nouns-text transition-colors"
                        disabled={isVoting}
                      >
                        CANCEL
                      </button>
                      <motion.button
                        whileHover={{ scale: isVoting ? 1 : 1.05 }}
                        whileTap={{ scale: isVoting ? 1 : 0.95 }}
                        onClick={castVote}
                        disabled={isVoting}
                        className={`px-6 py-3 rounded-lg font-pixel text-xs transition-all duration-200 flex items-center space-x-2 ${isVoting
                            ? 'bg-nouns-dark-grey text-white cursor-not-allowed'
                            : 'bg-nouns-blue text-white hover:shadow-lg'
                          }`}
                      >
                        {isVoting && <Loader className="animate-spin" size={16} />}
                        <Vote size={16} />
                        <span>{isVoting ? 'VOTING...' : 'CAST VOTE'}</span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};