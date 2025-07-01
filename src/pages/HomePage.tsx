import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gavel, MessageSquare, Settings, ArrowRight } from 'lucide-react';
import NounDisplay from '../components/NounDisplay';

// Noggles images array
const nogglesImages = [
  '0-glasses-hip-rose.png',
  '1-glasses-square-black-eyes-red.png',
  '2-glasses-square-black-rgb.png',
  '3-glasses-square-black.png',
  '4-glasses-square-blue-med-saturated.png',
  '5-glasses-square-blue.png',
  '6-glasses-square-frog-green.png',
  '7-glasses-square-fullblack.png',
  '8-glasses-square-green-blue-multi.png',
  '9-glasses-square-grey-light.png',
  '10-glasses-square-guava.png',
  '11-glasses-square-honey.png',
  '12-glasses-square-magenta.png',
  '13-glasses-square-orange.png',
  '14-glasses-square-pink-purple-multi.png',
  '15-glasses-square-red.png',
  '16-glasses-square-smoke.png',
  '17-glasses-square-teal.png',
  '18-glasses-square-watermelon.png',
  '19-glasses-square-yellow-orange-multi.png',
  '20-glasses-square-yellow-saturated.png',
  '21-glasses-deep-teal.png',
  '22-glasses-grass.png',
  '23-glasses-lavender.png'
];

// Animated Noggles Component
const AnimatedNoggles = () => {
  const [currentNoggleIndex, setCurrentNoggleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNoggleIndex((prev) => (prev + 1) % nogglesImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 bg-gradient-to-br from-nouns-blue/20 to-nouns-green/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
      <motion.div
        key={currentNoggleIndex}
        initial={{
          opacity: 0,
          scale: 0.5,
          rotate: -180
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0
        }}
        exit={{
          opacity: 0,
          scale: 1.2,
          rotate: 180
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          type: "spring",
          stiffness: 100
        }}
        className="relative"
      >
        <img
          src={`/src/assets/Noggles/${nogglesImages[currentNoggleIndex]}`}
          alt="Animated Noggles"
          className="w-32 h-32 object-contain filter drop-shadow-lg"
        />

        {/* Floating background elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-4 -right-4 w-8 h-8 bg-nouns-red/20 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-2 -left-2 w-6 h-6 bg-nouns-blue/20 rounded-full"
        />
      </motion.div>

      {/* Cycling indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {nogglesImages.slice(0, 5).map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${(currentNoggleIndex % 5) === index ? 'bg-nouns-red' : 'bg-white/50'
              }`}
            animate={
              (currentNoggleIndex % 5) === index
                ? { scale: [1, 1.3, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

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
              OWN THE <span className="text-nouns-red">PIXEL</span>
              <br />
              STEER THE <span className="text-nouns-blue">FUTURE</span>
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
                ENTER THE NOUNIVERSE
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
              <div className="text-center mb-4">
                <h3 className="font-londrina lg:text-2xl text-sm text-nouns-text mb-2">ICONIC NOGGLES</h3>
                <p className="text-xs text-nouns-dark-grey">The signature glasses that define our identity</p>
              </div>
              <AnimatedNoggles />
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
              EXPLORE THE <span className="text-nouns-red">NOUNIVERSE</span>
            </h2>
            <p className="text-xl text-nouns-dark-grey">
              Choose your path through the Nouns ecosystem
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