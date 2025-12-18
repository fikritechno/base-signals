/**
 * Event normalizer - converts raw blockchain data to normalized events
 */

import { NormalizedEvent, UserActivity } from "./types.js";

export class EventNormalizer {
  /**
   * Build user activity from normalized events
   */
  buildUserActivity(address: string, events: NormalizedEvent[]): UserActivity {
    const userEvents = events.filter((e) => e.address.toLowerCase() === address.toLowerCase());

    const activity: UserActivity = {
      address: address.toLowerCase(),
      events: userEvents,
      contractDeployments: 0,
      swapCount: 0,
      bridgeCount: 0,
      nftMintCount: 0,
      nftTransferCount: 0,
      governanceVoteCount: 0,
      totalValue: 0n,
      uniqueProtocols: new Set<string>(),
    };

    for (const event of userEvents) {
      // Count event types
      switch (event.eventType) {
        case "CONTRACT_DEPLOYMENT":
          activity.contractDeployments++;
          break;
        case "SWAP":
          activity.swapCount++;
          break;
        case "BRIDGE":
          activity.bridgeCount++;
          break;
        case "NFT_MINT":
          activity.nftMintCount++;
          break;
        case "NFT_TRANSFER":
          activity.nftTransferCount++;
          break;
        case "GOVERNANCE_VOTE":
          activity.governanceVoteCount++;
          break;
      }

      // Track protocols
      if (event.protocol) {
        activity.uniqueProtocols.add(event.protocol);
      }

      // Sum values
      activity.totalValue += event.value;

      // Track timestamps
      if (!activity.firstTxTimestamp || event.timestamp < activity.firstTxTimestamp) {
        activity.firstTxTimestamp = event.timestamp;
      }
      if (!activity.lastTxTimestamp || event.timestamp > activity.lastTxTimestamp) {
        activity.lastTxTimestamp = event.timestamp;
      }
    }

    return activity;
  }

  /**
   * Calculate days since first transaction
   */
  getDaysSinceFirstTx(activity: UserActivity): number {
    if (!activity.firstTxTimestamp) return 0;
    const now = Math.floor(Date.now() / 1000);
    return Math.floor((now - activity.firstTxTimestamp) / 86400);
  }

  /**
   * Calculate days since last transaction
   */
  getDaysSinceLastTx(activity: UserActivity): number {
    if (!activity.lastTxTimestamp) return 0;
    const now = Math.floor(Date.now() / 1000);
    return Math.floor((now - activity.lastTxTimestamp) / 86400);
  }

  /**
   * Get transaction count in last N days
   */
  getTxCountLastNDays(activity: UserActivity, days: number): number {
    const cutoff = Math.floor(Date.now() / 1000) - days * 86400;
    return activity.events.filter((e) => e.timestamp >= cutoff).length;
  }

  /**
   * Get average transaction value
   */
  getAvgTxValue(activity: UserActivity): bigint {
    if (activity.events.length === 0) return 0n;
    return activity.totalValue / BigInt(activity.events.length);
  }
}

