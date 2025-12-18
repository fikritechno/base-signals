/**
 * Base network listener for transaction events
 */

import { ethers } from "ethers";
import { NormalizedEvent, EventType } from "./types.js";

export class BaseListener {
  private provider: ethers.JsonRpcProvider;
  private currentBlock: number;
  private isRunning: boolean = false;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.currentBlock = 0;
  }

  /**
   * Start listening to Base network
   */
  async start(startBlock?: number): Promise<void> {
    if (this.isRunning) {
      throw new Error("Listener is already running");
    }

    this.isRunning = true;

    if (startBlock) {
      this.currentBlock = startBlock;
    } else {
      this.currentBlock = await this.provider.getBlockNumber();
    }

    console.log(`Starting Base listener from block ${this.currentBlock}`);
  }

  /**
   * Get new blocks and extract transactions
   */
  async getNewBlocks(): Promise<NormalizedEvent[]> {
    if (!this.isRunning) {
      return [];
    }

    const latestBlock = await this.provider.getBlockNumber();
    const events: NormalizedEvent[] = [];

    for (let blockNum = this.currentBlock + 1; blockNum <= latestBlock; blockNum++) {
      const block = await this.provider.getBlock(blockNum, true);
      if (!block || !block.transactions) continue;

      for (const tx of block.transactions) {
        if (typeof tx === "string") continue;

        const normalized = await this.normalizeTransaction(tx, blockNum, block.timestamp || 0);
        if (normalized) {
          events.push(normalized);
        }
      }
    }

    this.currentBlock = latestBlock;
    return events;
  }

  /**
   * Normalize a transaction into a NormalizedEvent
   */
  private async normalizeTransaction(
    tx: ethers.TransactionResponse,
    blockNumber: number,
    timestamp: number
  ): Promise<NormalizedEvent | null> {
    try {
      // Check if it's a contract deployment
      if (!tx.to) {
        return {
          address: tx.from,
          eventType: "CONTRACT_DEPLOYMENT",
          value: tx.value || 0n,
          timestamp,
          txHash: tx.hash,
          blockNumber,
          metadata: {
            contractAddress: await this.getContractAddress(tx),
          },
        };
      }

      // Check for common DEX patterns (simplified)
      if (this.isSwapTransaction(tx)) {
        return {
          address: tx.from,
          eventType: "SWAP",
          protocol: "Unknown",
          value: tx.value || 0n,
          timestamp,
          txHash: tx.hash,
          blockNumber,
        };
      }

      // Check for bridge patterns
      if (this.isBridgeTransaction(tx)) {
        return {
          address: tx.from,
          eventType: "BRIDGE",
          protocol: "Base Bridge",
          value: tx.value || 0n,
          timestamp,
          txHash: tx.hash,
          blockNumber,
        };
      }

      // Default: generic transaction
      return {
        address: tx.from,
        eventType: "SWAP", // Default fallback
        value: tx.value || 0n,
        timestamp,
        txHash: tx.hash,
        blockNumber,
      };
    } catch (error) {
      console.error(`Error normalizing transaction ${tx.hash}:`, error);
      return null;
    }
  }

  /**
   * Check if transaction is a swap
   */
  private isSwapTransaction(tx: ethers.TransactionResponse): boolean {
    // Simplified check - in production, check against known DEX contract addresses
    return false;
  }

  /**
   * Check if transaction is a bridge
   */
  private isBridgeTransaction(tx: ethers.TransactionResponse): boolean {
    // Simplified check - in production, check against known bridge contract addresses
    return false;
  }

  /**
   * Get contract address from deployment transaction
   */
  private async getContractAddress(tx: ethers.TransactionResponse): Promise<string | null> {
    try {
      const receipt = await this.provider.getTransactionReceipt(tx.hash);
      return receipt?.contractAddress || null;
    } catch {
      return null;
    }
  }

  /**
   * Stop the listener
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Get current block number
   */
  getCurrentBlock(): number {
    return this.currentBlock;
  }
}

