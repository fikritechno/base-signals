# BaseSignals

> **On-chain behavioral signals & intent graph for Base users**

[![Built for Base](https://img.shields.io/badge/Built%20for-Base-0052FF?style=flat-square)](https://base.org)
[![Deployed on Base](https://img.shields.io/badge/Deployed%20on-Base-0052FF?style=flat-square)](https://basescan.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

BaseSignals builds an **on-chain + off-chain intent & behavior graph** that detects *what users are trying to do* on Base (trade, farm, build, arbitrate, bridge, deploy, govern) and exposes it as **public, queryable signals** for dApps, DAOs, grants, and reputation systems.

## 🎯 Overview

BaseSignals provides behavioral intelligence for the Base ecosystem:

- **Behavioral Signals**: Detect user intent (builder, farmer, long-term participant, etc.)
- **Transparent Scoring**: Open-source, explainable signal generation rules
- **On-chain Attestations**: Verifiable signal registry on Base
- **Composable API**: Easy integration for protocols, DAOs, and dApps
- **Sybil Resistance**: Help identify genuine users vs. low-effort farmers

### Why BaseSignals?

Base ecosystem needs:
- ✅ Better Sybil resistance
- ✅ Better user segmentation  
- ✅ Better incentive targeting
- ✅ Better builder analytics

BaseSignals provides:
- ✅ Primitive-level data layer
- ✅ Open signals, not black-box scoring
- ✅ Composable with other Base projects
- ✅ Useful even without a token

## 🏗️ Architecture

```
Wallet actions → normalized events → behavior signals → intent tags → public graph
```

### Core Components

1. **Smart Contracts** (`contracts/`)
   - `SignalRegistry.sol` - Stores verifiable signal attestations
   - `SignalAttestor.sol` - Manages attestor permissions

2. **Indexer** (`indexer/`)
   - Base RPC listener
   - Event normalizer
   - Signal engine

3. **Backend API** (`backend/`)
   - REST API endpoints
   - Caching layer
   - Signal querying

4. **Frontend Dashboard** (`frontend/`)
   - Address explorer
   - Signal visualization
   - Network analytics

5. **SDK** (`sdk/`)
   - JavaScript SDK for easy integration

6. **Signal Definitions** (`signals/`)
   - YAML-based signal rules
   - Transparent and auditable

## 📊 Signal Types

### MVP Signals

- **BUILDER_SIGNAL**: Detects users who deploy and interact with smart contracts
- **FARMER_SIGNAL**: Identifies airdrop farming behavior
- **LONG_TERM_SIGNAL**: Recognizes long-term participants
- **ACTIVE_USER_SIGNAL**: Active engagement on Base
- **NEWCOMER_SIGNAL**: New users to the ecosystem

### Signal Scoring

Signals are:
- **Transparent**: Rules defined in YAML
- **Time-weighted**: Recent activity matters more
- **Explainable**: Clear reasoning for each signal
- **Queryable**: Via API and SDK

## 🚀 Quick Start

### Prerequisites

- Node.js ≥18
- Foundry (for contracts)
- Base RPC access

### Installation

```bash
# Clone the repository
git clone https://github.com/fikritechno/basesignals.git
cd basesignals

# Install dependencies
npm install

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Development

```bash
# Start indexer
cd indexer
npm run dev

# Start backend API
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev
```

### Contract Deployment

```bash
# Deploy to Base Sepolia
cd contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC --broadcast --verify

# Deploy to Base Mainnet
forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_MAINNET_RPC --broadcast --verify
```

## 📖 Usage

### SDK Example

```typescript
import { BaseSignals } from "@basesignals/sdk";

const client = new BaseSignals({
  apiUrl: "https://api.basesignals.xyz"
});

// Get signals for an address
const signals = await client.getSignals("0x...");
console.log(signals);
// {
//   address: "0x...",
//   signals: [
//     { type: "BUILDER", score: 72 },
//     { type: "LONG_TERM", score: 41 }
//   ],
//   intent: "builder"
// }

// Get primary intent
const intent = await client.getPrimaryIntent("0x...");
```

### API Example

```bash
# Get signals for an address
curl https://api.basesignals.xyz/address/0x.../signals

# Get top builders
curl https://api.basesignals.xyz/signal/BUILDER/top?limit=10
```

## 🔗 Links

- **Chain ID**: 8453 (Base Mainnet), 84532 (Base Sepolia)
- **Contract**: [View on Basescan](https://basescan.org/address/0x...) (TBD)
- **Frontend**: [https://basesignals.xyz](https://basesignals.xyz) (TBD)
- **API Docs**: [docs/api.md](docs/api.md)
- **Signal Definitions**: [signals/definitions.yaml](signals/definitions.yaml)

## 📁 Project Structure

```
basesignals/
├── contracts/
│   ├── SignalRegistry.sol
│   ├── SignalAttestor.sol
│   ├── interfaces/
│   ├── tests/
│   └── script/
├── indexer/
│   ├── base-listener.ts
│   ├── event-normalizer.ts
│   └── signal-engine.ts
├── backend/
│   ├── api.ts
│   └── cache/
├── frontend/
│   ├── nextjs/
│   └── dashboard/
├── sdk/
│   └── js/
├── signals/
│   └── definitions.yaml
├── tests/
├── docs/
│   ├── signals.md
│   ├── scoring.md
│   └── sybil.md
├── .github/
│   └── workflows/
└── README.md
```

## 🛣️ Roadmap

### Phase 1: MVP ✅
- [x] Project structure
- [ ] SignalRegistry contract
- [ ] SignalAttestor contract
- [ ] 5 signal types (BUILDER, FARMER, LONG_TERM, ACTIVE_USER, NEWCOMER)
- [ ] Base Sepolia indexer
- [ ] Signal engine
- [ ] Basic API
- [ ] Simple dashboard

### Phase 2: Release 🚧
- [ ] Deploy to Base Mainnet
- [ ] Enhanced signal rules
- [ ] Advanced dashboard
- [ ] JS SDK release
- [ ] API documentation
- [ ] Example integrations

### Phase 3: Ecosystem Expansion 🔮
- [ ] Additional signal types
- [ ] Protocol integrations
- [ ] DAO partnerships
- [ ] Community contributions
- [ ] Advanced analytics

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for [Base](https://base.org)
- Inspired by the need for better user segmentation in Web3
- Part of the Base ecosystem infrastructure

## 📞 Contact

- **Twitter**: [@BaseSignals](https://twitter.com/basesignals) (TBD)
- **Discord**: [Base Builders](https://discord.gg/base)
- **Issues**: [GitHub Issues](https://github.com/fikritechno/basesignals/issues)

---

**Built with ❤️ for Base**

