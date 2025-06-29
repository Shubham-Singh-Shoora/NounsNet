import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, Clock, CheckCircle, XCircle, Users } from 'lucide-react';

const ProposalsPage = () => {
  const [filter, setFilter] = useState('all');

  const proposals = [
    {
      id: 1,
      title: 'Fund Community Art Initiative',
      description: 'Allocate 50 ETH to support emerging digital artists in the Nouns ecosystem.',
      status: 'active',
      votesFor: 234,
      votesAgainst: 45,
      timeLeft: '2 days',
      proposer: '0x1234...5678',
      category: 'funding'
    },
    {
      id: 2,
      title: 'Upgrade Treasury Management',
      description: 'Implement new smart contract for more efficient treasury operations.',
      status: 'passed',
      votesFor: 456,
      votesAgainst: 23,
      timeLeft: 'Ended',
      proposer: '0x9876...5432',
      category: 'governance'
    },
    {
      id: 3,
      title: 'Partnership with MetaMuseum',
      description: 'Establish strategic partnership for digital art exhibitions.',
      status: 'active',
      votesFor: 123,
      votesAgainst: 67,
      timeLeft: '5 days',
      proposer: '0x4567...8901',
      category: 'partnership'
    },
    {
      id: 4,
      title: 'Community Events Budget',
      description: 'Approve quarterly budget for community meetups and events.',
      status: 'failed',
      votesFor: 89,
      votesAgainst: 234,
      timeLeft: 'Ended',
      proposer: '0x2345...6789',
      category: 'funding'
    }
  ];

  const filteredProposals = filter === 'all' 
    ? proposals 
    : proposals.filter(p => p.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-nouns-blue bg-blue-50';
      case 'passed': return 'text-nouns-green bg-green-50';
      case 'failed': return 'text-nouns-red bg-red-50';
      default: return 'text-nouns-dark-grey bg-nouns-grey';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock size={16} />;
      case 'passed': return <CheckCircle size={16} />;
      case 'failed': return <XCircle size={16} />;
      default: return <Vote size={16} />;
    }
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
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            {['all', 'active', 'passed', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 rounded-xl font-pixel text-xs transition-all duration-200 ${
                  filter === status
                    ? 'bg-nouns-red text-white'
                    : 'text-nouns-dark-grey hover:text-nouns-text hover:bg-nouns-grey'
                }`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Proposals Grid */}
        <div className="space-y-6">
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
                    <span className={`px-3 py-1 rounded-full text-xs font-pixel flex items-center space-x-1 ${getStatusColor(proposal.status)}`}>
                      {getStatusIcon(proposal.status)}
                      <span>{proposal.status.toUpperCase()}</span>
                    </span>
                    <span className="text-xs text-nouns-dark-grey">
                      by {proposal.proposer}
                    </span>
                  </div>
                  <h3 className="font-londrina text-2xl font-bold mb-2">
                    {proposal.title}
                  </h3>
                  <p className="text-nouns-dark-grey leading-relaxed">
                    {proposal.description}
                  </p>
                </div>
                <div className="text-right ml-6">
                  <div className="text-sm text-nouns-dark-grey mb-1">
                    {proposal.timeLeft}
                  </div>
                  <div className="font-pixel text-xs text-nouns-red">
                    #{proposal.id}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Votes For */}
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-pixel text-nouns-green">FOR</span>
                    <CheckCircle className="text-nouns-green" size={16} />
                  </div>
                  <div className="font-londrina text-2xl font-bold text-nouns-green">
                    {proposal.votesFor}
                  </div>
                </div>

                {/* Votes Against */}
                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-pixel text-nouns-red">AGAINST</span>
                    <XCircle className="text-nouns-red" size={16} />
                  </div>
                  <div className="font-londrina text-2xl font-bold text-nouns-red">
                    {proposal.votesAgainst}
                  </div>
                </div>

                {/* Vote Button */}
                <div className="flex items-center">
                  {proposal.status === 'active' ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-nouns-blue text-white py-3 rounded-xl font-pixel text-xs hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Vote size={16} />
                      <span>VOTE</span>
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
          >
            <Users size={16} />
            <span>CREATE PROPOSAL</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProposalsPage;