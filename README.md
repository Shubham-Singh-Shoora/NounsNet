# Nouniverse Portal 🏛️

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-6.0+-29B6F6?style=for-the-badge&logo=ethereum&logoColor=white)](https://docs.ethers.org/)

> **Own the Pixel. Steer the Future.** - A modern, responsive web portal for the Nouns DAO ecosystem, built with cutting-edge web technologies and blockchain integration.

## 🌟 Project Overview

NounsNet Portal is a comprehensive decentralized application (dApp) that serves as the primary interface for interacting with the Nouns DAO ecosystem. The application provides seamless access to:

- **Live Auction System**: Real-time bidding on unique Nouns NFTs
- **Governance Portal**: Proposal creation, voting, and DAO management
- **Wallet Integration**: Secure MetaMask connection and transaction handling
- **Network Configuration**: Customizable RPC and Graph API endpoints

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   React     │  │ TypeScript  │  │ Tailwind CSS│        │
│  │ Components  │  │   Types     │  │   Styling   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   State Management                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ React Hooks │  │ LocalStorage│  │   Context   │        │
│  │   Custom    │  │ Persistence │  │   Providers │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 Blockchain Integration                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Ethers.js  │  │   MetaMask  │  │  Graph API  │        │
│  │ Web3 Client │  │   Wallet    │  │  Indexing   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   External Services                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Ethereum    │  │ Nouns API   │  │  IPFS/CDN   │        │
│  │  Network    │  │  Endpoints  │  │   Assets    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### **Core Framework**
- **React 18+**: Modern React with Concurrent Features, Suspense, and latest hooks
- **TypeScript 5.0+**: Full type safety, enhanced developer experience, and robust error handling
- **Vite 5.0+**: Lightning-fast build tool with HMR and optimized production builds

### **Styling & UI**
- **Tailwind CSS 3.4+**: Utility-first CSS framework with custom Nouns theme
- **Framer Motion**: Smooth animations and micro-interactions
- **Lucide React**: Beautiful, customizable icon library
- **Custom Design System**: Nouns-branded color palette and typography

### **Blockchain Integration**
- **Ethers.js 6.0+**: Ethereum blockchain interaction and smart contract integration
- **MetaMask Provider**: Secure wallet connection and transaction signing
- **The Graph Protocol**: Decentralized indexing for blockchain data
- **Custom RPC Support**: Configurable network endpoints

### **State Management**
- **React Context**: Global application state management
- **Custom Hooks**: Reusable business logic and data fetching
- **LocalStorage**: Persistent user preferences and wallet state
- **Real-time Updates**: Live data synchronization with blockchain

### **Development Tools**
- **ESLint**: Code quality and consistency enforcement
- **PostCSS**: CSS processing and optimization
- **TypeScript Compiler**: Type checking and compilation
- **Vite DevServer**: Hot module replacement and fast development

## 📁 Project Structure

```
Nouniverse/
├── 📂 public/                    # Static assets and metadata
│   ├── vite.svg                  # Default Vite favicon
│   └── index.html                # Main HTML template
├── 📂 src/                       # Source code directory
│   ├── 📂 assets/                # Static assets and images
│   │   ├── head-earth.png        # Favicon and logo assets
│   │   ├── noun-*.png            # Noun character images
│   │   └── 📂 Noggles/           # Noggles glasses collection
│   │       ├── 0-glasses-hip-rose.png
│   │       ├── 1-glasses-square-black.svg
│   │       └── ... (40+ variations)
│   ├── 📂 components/            # Reusable React components
│   │   ├── Navigation.tsx        # Header navigation with mobile menu
│   │   ├── NounDisplay.tsx       # 3D Noun showcase component
│   │   └── ...
│   ├── 📂 pages/                 # Main application pages
│   │   ├── HomePage.tsx          # Landing page with hero section
│   │   ├── AuctionPage.tsx       # Live auction interface
│   │   ├── ProposalsPage.tsx     # DAO governance portal
│   │   └── SettingsPage.tsx      # User configuration panel
│   ├── 📂 hooks/                 # Custom React hooks
│   │   ├── useAuctionBids.ts     # Auction data management
│   │   ├── useNounData.ts        # Noun metadata fetching
│   │   ├── useNounTraits.ts      # Trait data processing
│   │   ├── useGraph.ts           # Graph API integration
│   │   └── ...
│   ├── 📂 lib/                   # Utility libraries
│   │   ├── ether.ts              # Ethereum provider setup
│   │   └── graph.ts              # GraphQL query handling
│   ├── 📂 config/                # Configuration files
│   │   └── endpoint.tsx          # RPC and API endpoint management
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles and Tailwind imports
├── 📂 configuration files        # Build and development configuration
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.js        # Tailwind CSS customization
│   ├── vite.config.ts            # Vite build configuration
│   ├── eslint.config.js          # ESLint rules and settings
│   └── postcss.config.js         # PostCSS plugin configuration
└── README.md                     # This documentation file
```

## 🚀 Quick Start

### **Prerequisites**
- **Node.js**: Version 18+ (LTS recommended)
- **npm**: Version 9+ (comes with Node.js)
- **MetaMask**: Browser extension for wallet integration
- **Git**: For version control and cloning

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nounsnet-portal.git
   cd nounsnet-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Configure your environment variables
   nano .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open application**
   ```
   Navigate to: http://localhost:5173
   ```

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code quality check
npm run type-check   # Run TypeScript type checking

# Utilities
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
```

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file with the following configuration:

```env
# Ethereum Network Configuration
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
VITE_ETHEREUM_CHAIN_ID=1

# The Graph API Configuration
VITE_GRAPH_API_URL=https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph

# Nouns Contract Addresses
VITE_NOUNS_TOKEN_ADDRESS=0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03
VITE_NOUNS_AUCTION_ADDRESS=0x830BD73E4184ceF73443C15111a1DF14e495C706
VITE_NOUNS_DAO_ADDRESS=0x6f3E6272A167e8AcCb32072d08E0957F9c79223d

# Application Configuration
VITE_APP_NAME=NounsNet Portal
VITE_APP_VERSION=1.0.0
```

### **Network Settings**

The application supports custom RPC and Graph API endpoints through the Settings page:

- **Ethereum RPC**: Configure custom Ethereum node endpoints
- **Graph API**: Set custom subgraph endpoints for data indexing
- **Connection Testing**: Real-time endpoint validation and status indicators

### **Tailwind Configuration**

Custom Nouns-themed design system defined in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'nouns-red': '#E1282E',
        'nouns-blue': '#4C82FB',
        'nouns-green': '#00D395',
        'nouns-yellow': '#FFCC02',
        'nouns-grey': '#F3F4F6',
        'nouns-dark-grey': '#6B7280',
        'nouns-text': '#1F2937',
        'nouns-bg': '#FFFFFF'
      },
      fontFamily: {
        'londrina': ['Londrina Solid', 'cursive'],
        'pixel': ['Press Start 2P', 'monospace'],
        'inter': ['Inter', 'sans-serif']
      }
    }
  }
}
```

## 🎯 Core Features

### **1. Auction System**
- **Real-time Bidding**: Live auction interface with countdown timers
- **Bid History**: Complete bidding history with bidder identification
- **Wallet Integration**: Secure MetaMask connection for placing bids
- **Noun Visualization**: 3D Sketchfab integration for Noun display
- **Trait Analysis**: Detailed breakdown of Noun characteristics

### **2. Governance Portal**
- **Proposal Viewing**: Browse all DAO proposals with filtering
- **Voting Interface**: Cast votes on active proposals
- **Proposal Creation**: Submit new proposals to the DAO
- **Delegation**: Manage voting power delegation
- **Execution Tracking**: Monitor proposal execution status

### **3. Wallet Management**
- **MetaMask Integration**: Seamless wallet connection
- **Multi-network Support**: Switch between Ethereum networks
- **Balance Tracking**: Real-time ETH and token balance display
- **Transaction History**: View past interactions
- **Security Features**: Secure transaction signing

### **4. Settings & Configuration**
- **Network Configuration**: Custom RPC and Graph API endpoints
- **Connection Testing**: Real-time endpoint validation
- **Profile Management**: User preferences and display settings
- **Notification Settings**: Customize alert preferences
- **Theme Customization**: Appearance and accessibility options

## 🔗 Blockchain Integration

### **Smart Contract Interaction**

The application interacts with several key Nouns DAO smart contracts:

```typescript
// Contract Addresses (Mainnet)
const CONTRACTS = {
  NounsToken: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
  NounsAuctionHouse: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
  NounsDAOProxy: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
  NounsDescriptor: '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63'
};
```

### **Key Integrations**

1. **Auction House**: Real-time bidding and auction management
2. **DAO Governance**: Proposal creation, voting, and execution
3. **Token Contract**: Noun ownership and transfer tracking
4. **Descriptor**: Trait generation and metadata retrieval

### **Graph Protocol Queries**

Efficient blockchain data indexing using The Graph:

```graphql
query AuctionData($nounId: String!) {
  auction(id: $nounId) {
    id
    nounId
    amount
    startTime
    endTime
    bidder
    settled
    bids(orderBy: amount, orderDirection: desc) {
      id
      bidder {
        id
        tokenBalance
      }
      amount
      blockTimestamp
    }
  }
}
```

## 📱 Mobile Optimization

### **Responsive Design Features**

- **Mobile-First Approach**: Optimized for mobile devices first
- **Touch-Friendly Interface**: Minimum 44px touch targets
- **Responsive Navigation**: Hamburger menu with smooth animations
- **Adaptive Typography**: Scales from mobile to desktop
- **Performance Optimized**: Reduced animations on mobile devices

### **Screen Size Support**

- **Mobile**: 320px - 767px (sm breakpoint)
- **Tablet**: 768px - 1023px (md breakpoint)
- **Desktop**: 1024px+ (lg breakpoint)
- **Large Desktop**: 1280px+ (xl breakpoint)

## 🧪 Testing & Development

### **Code Quality**

- **TypeScript**: 100% type coverage for enhanced reliability
- **ESLint**: Consistent code style and error prevention
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality assurance

### **Performance Monitoring**

- **Bundle Analysis**: Vite bundle analyzer for optimization
- **Lighthouse Scores**: Web performance monitoring
- **Core Web Vitals**: User experience metrics tracking
- **Memory Usage**: React DevTools profiling

### **Browser Support**

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Android Chrome 90+
- **Web3 Support**: MetaMask, WalletConnect, Coinbase Wallet

## 🚀 Deployment

### **Production Build**

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

### **Deployment Platforms**

The application is optimized for deployment on:

- **Vercel**: Zero-config deployment with automatic HTTPS
- **Netlify**: Edge computing and CDN distribution
- **AWS S3 + CloudFront**: Enterprise-scale hosting
- **IPFS**: Decentralized hosting for Web3 applications

### **Environment Configuration**

Production deployment requires:

1. **Environment Variables**: Configure all required API keys
2. **Build Optimization**: Enable production optimizations
3. **HTTPS**: Secure connection for MetaMask integration
4. **CDN**: Asset optimization and global distribution

## 🤝 Contributing

### **Development Workflow**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Coding Standards**

- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow project linting rules
- **Prettier**: Use automated formatting
- **Conventional Commits**: Follow commit message standards

### **Pull Request Process**

1. Update documentation for new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nouns DAO**: For creating the innovative NFT and governance ecosystem
- **Ethereum Foundation**: For the robust blockchain infrastructure
- **React Team**: For the powerful component framework
- **Vite Team**: For the blazing-fast build tool
- **Tailwind CSS**: For the utility-first styling approach

## 📞 Support & Contact

- **Documentation**: [Project Wiki](https://github.com/your-username/nounsnet-portal/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/nounsnet-portal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/nounsnet-portal/discussions)
- **Discord**: [Nouns DAO Discord](https://discord.gg/nouns)

---

<div align="center">

**Built with ❤️ for the Nouns community**

[🌐 Live Demo](https://nounsnet-portal.vercel.app) • [📖 Documentation](https://docs.nounsnet.com) • [🐦 Twitter](https://twitter.com/nounsdao)

</div>
