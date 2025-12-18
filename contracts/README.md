# BaseSignals Contracts

Smart contracts for the BaseSignals protocol.

## Setup

```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install OpenZeppelin contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Build
forge build

# Run tests
forge test
```

## Contracts

### SignalRegistry.sol

Stores verifiable signal attestations on-chain.

**Key Functions:**
- `attestSignal(address user, bytes32 signalType, uint256 score)` - Attest a signal
- `revokeSignal(address user, bytes32 signalType)` - Revoke a signal
- `getSignals(address user)` - Get all signals for a user
- `getSignalScore(address user, bytes32 signalType)` - Get specific signal score

### SignalAttestor.sol

Manages who can attest signals.

**Key Functions:**
- `addAttestor(address attestor)` - Add an attestor (owner only)
- `removeAttestor(address attestor)` - Remove an attestor (owner only)
- `isAttestor(address attestor)` - Check if address is an attestor

## Deployment

### Base Sepolia

```bash
export PRIVATE_KEY=your_private_key
export BASE_SEPOLIA_RPC=https://sepolia.base.org
export BASESCAN_API_KEY=your_basescan_api_key

forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC --broadcast --verify
```

### Base Mainnet

```bash
export BASE_MAINNET_RPC=https://mainnet.base.org

forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_MAINNET_RPC --broadcast --verify
```

## Testing

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test test_AttestSignal
```

## Signal Types

Signal types are defined as `keccak256("SIGNAL_NAME")`:

- `BUILDER` = keccak256("BUILDER")
- `FARMER` = keccak256("FARMER")
- `LONG_TERM` = keccak256("LONG_TERM")
- `ACTIVE_USER` = keccak256("ACTIVE_USER")
- `NEWCOMER` = keccak256("NEWCOMER")

