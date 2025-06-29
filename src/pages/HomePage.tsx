import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gavel, MessageSquare, Settings, ArrowRight } from 'lucide-react';
import NounDisplay from '../components/NounDisplay';

const HomePage = () => {
  const portalCards = [
    {
      title: 'THE AUCTION HOUSE',
      description: 'Bid on unique digital artifacts',
      path: '/auction',
      icon: Gavel,
      color: 'bg-nouns-red',
      gradient: 'from-nouns-red to-red-600'
    },
    {
      title: 'THE FORUM OF IDEAS',
      description: 'Vote on proposals that shape the future',
      path: '/proposals',
      icon: MessageSquare,
      color: 'bg-nouns-blue',
      gradient: 'from-nouns-blue to-blue-600'
    },
    {
      title: 'THE CONTROL ROOM',
      description: 'Manage your digital identity',
      path: '/settings',
      icon: Settings,
      color: 'bg-nouns-green',
      gradient: 'from-nouns-green to-green-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.h1 
              className="font-londrina text-6xl lg:text-8xl font-black leading-tight"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              OWN THE <span className="text-nouns-red">PIXEL</span>.
              <br />
              STEER THE <span className="text-nouns-blue">FUTURE</span>.
            </motion.h1>
            <motion.p 
              className="text-xl text-nouns-dark-grey leading-relaxed max-w-lg"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Enter the decentralized universe where every pixel tells a story, 
              every vote shapes reality, and every member owns a piece of the future.
            </motion.p>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-nouns-red to-red-600 text-white px-8 py-4 rounded-xl font-pixel text-sm hover:shadow-xl transition-all duration-300 transform"
              >
                ENTER THE UNIVERSE
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="flex justify-center"
          >
            <NounDisplay />
          </motion.div>
        </div>
      </section>

      {/* What is NounsNet Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-nouns-grey to-gray-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="font-londrina text-5xl font-black text-nouns-text">
              A UNIVERSE, <span className="text-nouns-red">DECENTRALIZED</span>.
            </h2>
            <div className="space-y-4 text-lg text-nouns-dark-grey leading-relaxed">
              <p>
                NounsNet is more than a DAO—it's a living, breathing digital ecosystem 
                where creativity meets governance, and pixels become power.
              </p>
              <p>
                Every 24 hours, a new Noun is born. Every holder becomes a steward. 
                Every decision shapes our collective future.
              </p>
              <p>
                Welcome to the intersection of art, technology, and democracy.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="w-full h-64 bg-gradient-to-br from-nouns-blue/20 to-nouns-green/20 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-nouns-red to-nouns-blue rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portal Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-londrina text-5xl font-black mb-4">
              EXPLORE THE <span className="text-nouns-red">UNIVERSE</span>
            </h2>
            <p className="text-xl text-nouns-dark-grey">
              Choose your path through the NounsNet ecosystem
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {portalCards.map((card, index) => (
              <motion.div
                key={card.path}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link to={card.path}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform">
                    <div className={`bg-gradient-to-br ${card.gradient} h-48 flex items-center justify-center relative overflow-hidden`}>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                      >
                        <card.icon size={32} className="text-white" />
                      </motion.div>
                      
                      {/* Floating elements */}
                      <motion.div
                        animate={{ 
                          x: [0, 20, 0],
                          y: [0, -20, 0],
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                        className="absolute top-4 right-4 w-3 h-3 bg-white/40 rounded-full"
                      />
                      <motion.div
                        animate={{ 
                          x: [0, -15, 0],
                          y: [0, -25, 0],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: index * 0.7 }}
                        className="absolute bottom-4 left-4 w-2 h-2 bg-white/50 rounded-full"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="font-pixel text-sm text-nouns-text mb-3">
                        {card.title}
                      </h3>
                      <p className="text-nouns-dark-grey mb-6 leading-relaxed">
                        {card.description}
                      </p>
                      <motion.div 
                        className="flex items-center text-nouns-red group-hover:translate-x-2 transition-transform duration-300"
                        whileHover={{ x: 4 }}
                      >
                        <span className="font-pixel text-xs mr-2">ENTER</span>
                        <ArrowRight size={16} />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;