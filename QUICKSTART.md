# BaseSignals Quick Start Guide

## Prerequisites

- Node.js ≥18
- Foundry (for contracts)
- Base RPC access (get from [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/))

## Installation

```bash
# Install all dependencies
npm run install:all
```

## Development Setup

### 1. Contracts

```bash
cd contracts

# Install Foundry dependencies
forge install

# Run tests
forge test

# Build
forge build
```

### 2. Indexer

```bash
cd indexer

# Create .env file
echo "BASE_RPC_URL=https://sepolia.base.org" > .env

# Run indexer
npm run dev
```

### 3. Backend API

```bash
cd backend

# Create .env file
echo "PORT=3001" > .env

# Run API
npm run dev
```

### 4. Frontend

```bash
cd frontend

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id" >> .env.local

# Run frontend
npm run dev
```

## Deployment

### Contracts to Base Sepolia

```bash
cd contracts

# Set environment variables
export PRIVATE_KEY=your_private_key
export BASE_SEPOLIA_RPC=https://sepolia.base.org
export BASESCAN_API_KEY=your_basescan_api_key

# Deploy
forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC --broadcast --verify
```

### Contracts to Base Mainnet

```bash
export BASE_MAINNET_RPC=https://mainnet.base.org
forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_MAINNET_RPC --broadcast --verify
```

## Next Steps

1. **Create GitHub repository** (see SETUP_GITHUB.md)
2. **Deploy contracts** to Base Sepolia
3. **Run indexer** to start collecting data
4. **Test API** endpoints
5. **Deploy frontend** to Vercel/Netlify
6. **Update README** with deployed addresses

## Environment Variables

### Indexer
- `BASE_RPC_URL`: Base network RPC URL

### Backend
- `PORT`: API server port (default: 3001)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID

### Contracts
- `PRIVATE_KEY`: Deployer private key
- `BASE_SEPOLIA_RPC`: Base Sepolia RPC URL
- `BASE_MAINNET_RPC`: Base Mainnet RPC URL
- `BASESCAN_API_KEY`: Basescan API key for verification

## Troubleshooting

### Indexer not finding signals file
Make sure `signals/definitions.yaml` exists at the project root.

### Contract tests failing
Run `forge install` to install OpenZeppelin contracts.

### Frontend build errors
Make sure all environment variables are set in `.env.local`.

