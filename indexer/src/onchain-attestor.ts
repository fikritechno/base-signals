/**
 * On-chain signal attestation
 */

import { ethers } from "ethers";
import { SignalScore } from "./types.js";

const SIGNAL_REGISTRY_ADDRESS = "0x1Ca9B0Bd7E8e22878B7CF4090F2c0ef77109e99E";
const SIGNAL_ATTESTOR_ADDRESS = "0x64cC5880060379fdcE63A09003c5De255a8fCCAC";

// ABI for SignalRegistry
const SIGNAL_REGISTRY_ABI = [
  "function attestSignal(address user, bytes32 signalType, uint256 score) external",
  "function getSignalScore(address user, bytes32 signalType) external view returns (uint256)",
  "function hasSignal(address user, bytes32 signalType) external view returns (bool)",
];

export class OnChainAttestor {
  private provider: ethers.JsonRpcProvider;
  private registry: ethers.Contract;
  private signer?: ethers.Wallet;

  constructor(rpcUrl: string, privateKey?: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.registry = new ethers.Contract(
      SIGNAL_REGISTRY_ADDRESS,
      SIGNAL_REGISTRY_ABI,
      this.provider
    );

    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider);
      this.registry = this.registry.connect(this.signer);
    }
  }

  /**
   * Attest a signal on-chain
   */
  async attestSignal(
    userAddress: string,
    signal: SignalScore
  ): Promise<boolean> {
    if (!this.signer) {
      console.warn("No signer configured, skipping on-chain attestation");
      return false;
    }

    try {
      // Convert signal type to bytes32
      const signalType = ethers.id(signal.signalType);
      const score = signal.score;

      const tx = await this.registry.attestSignal(userAddress, signalType, score);
      console.log(`   📝 On-chain attestation tx: ${tx.hash}`);
      
      await tx.wait();
      console.log(`   ✅ On-chain attestation confirmed`);
      return true;
    } catch (error: any) {
      console.error(`   ❌ On-chain attestation failed:`, error.message);
      return false;
    }
  }

  /**
   * Attest multiple signals for a user
   */
  async attestSignals(
    userAddress: string,
    signals: SignalScore[]
  ): Promise<number> {
    let successCount = 0;
    for (const signal of signals) {
      if (await this.attestSignal(userAddress, signal)) {
        successCount++;
      }
    }
    return successCount;
  }
}

