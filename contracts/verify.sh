#!/bin/bash

# Contract verification script for Base Sepolia
# Make sure BASESCAN_API_KEY is set: export BASESCAN_API_KEY=your_key

set -e

echo "🔍 Verifying contracts on Base Sepolia..."

# Verify SignalAttestor
echo ""
echo "Verifying SignalAttestor..."
forge verify-contract \
  0x64cC5880060379fdcE63A09003c5De255a8fCCAC \
  src/SignalAttestor.sol:SignalAttestor \
  --chain-id 84532 \
  --etherscan-api-key ${BASESCAN_API_KEY:-"YOUR_API_KEY"} \
  --compiler-version 0.8.20 \
  --num-of-optimizations 200

echo ""
echo "Verifying SignalRegistry..."
forge verify-contract \
  0x1Ca9B0Bd7E8e22878B7CF4090F2c0ef77109e99E \
  src/SignalRegistry.sol:SignalRegistry \
  --chain-id 84532 \
  --etherscan-api-key ${BASESCAN_API_KEY:-"YOUR_API_KEY"} \
  --compiler-version 0.8.20 \
  --num-of-optimizations 200 \
  --constructor-args $(cast abi-encode "constructor(address)" 0x64cC5880060379fdcE63A09003c5De255a8fCCAC)

echo ""
echo "✅ Verification complete!"

