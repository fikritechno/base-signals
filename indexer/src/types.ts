/**
 * Type definitions for BaseSignals indexer
 */

export interface NormalizedEvent {
  address: string;
  eventType: EventType;
  protocol?: string;
  value: bigint;
  timestamp: number;
  txHash: string;
  blockNumber: number;
  metadata?: Record<string, any>;
}

export type EventType =
  | "CONTRACT_DEPLOYMENT"
  | "SWAP"
  | "BRIDGE"
  | "NFT_MINT"
  | "NFT_TRANSFER"
  | "GOVERNANCE_VOTE"
  | "ESCROW_USAGE"
  | "ARBITRATION";

export interface UserActivity {
  address: string;
  events: NormalizedEvent[];
  firstTxTimestamp?: number;
  lastTxTimestamp?: number;
  contractDeployments: number;
  swapCount: number;
  bridgeCount: number;
  nftMintCount: number;
  nftTransferCount: number;
  governanceVoteCount: number;
  totalValue: bigint;
  uniqueProtocols: Set<string>;
}

export interface SignalScore {
  signalType: string;
  score: number;
  explanation: string;
  timestamp: number;
}

export interface UserSignals {
  address: string;
  signals: SignalScore[];
  primaryIntent?: string;
  lastUpdated: number;
}

export interface SignalDefinition {
  description: string;
  conditions: Record<string, any>;
  score: {
    base: number;
    multiplier?: string;
    max: number;
  };
  time_decay?: {
    enabled: boolean;
    half_life_days: number;
  };
}

