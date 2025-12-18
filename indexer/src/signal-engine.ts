/**
 * Signal engine - generates signals from user activity
 */

import { readFileSync } from "fs";
import { parse } from "yaml";
import { UserActivity, SignalScore, SignalDefinition, UserSignals } from "./types.js";
import { EventNormalizer } from "./event-normalizer.js";

export class SignalEngine {
  private signalDefinitions: Record<string, SignalDefinition>;
  private normalizer: EventNormalizer;

  constructor(signalsFilePath: string) {
    const fileContent = readFileSync(signalsFilePath, "utf-8");
    const parsed = parse(fileContent);
    this.signalDefinitions = parsed.signals || {};
    this.normalizer = new EventNormalizer();
  }

  /**
   * Generate signals for a user based on their activity
   */
  generateSignals(activity: UserActivity): UserSignals {
    const signals: SignalScore[] = [];

    for (const [signalType, definition] of Object.entries(this.signalDefinitions)) {
      const score = this.calculateSignalScore(activity, signalType, definition);
      if (score > 0) {
        signals.push({
          signalType,
          score,
          explanation: this.generateExplanation(activity, signalType, definition),
          timestamp: Date.now(),
        });
      }
    }

    // Determine primary intent
    const primaryIntent = this.determinePrimaryIntent(signals);

    return {
      address: activity.address,
      signals,
      primaryIntent,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Calculate signal score based on definition
   */
  private calculateSignalScore(
    activity: UserActivity,
    signalType: string,
    definition: SignalDefinition
  ): number {
    // Check conditions
    if (!this.checkConditions(activity, definition.conditions)) {
      return 0;
    }

    // Calculate base score
    let score = definition.score.base;

    // Apply multiplier if specified
    if (definition.score.multiplier) {
      const multiplier = this.calculateMultiplier(activity, definition.score.multiplier);
      score = Math.floor(score * multiplier);
    }

    // Apply time decay if enabled
    if (definition.time_decay?.enabled) {
      score = this.applyTimeDecay(score, activity, definition.time_decay.half_life_days);
    }

    // Cap at max
    return Math.min(score, definition.score.max);
  }

  /**
   * Check if conditions are met
   */
  private checkConditions(activity: UserActivity, conditions: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      if (!this.evaluateCondition(activity, key, value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(activity: UserActivity, key: string, expected: any): boolean {
    const normalizer = this.normalizer;

    switch (key) {
      case "contract_deployments":
        return activity.contractDeployments >= expected;
      case "active_days":
        return normalizer.getDaysSinceFirstTx(activity) >= expected;
      case "small_swaps_count":
        return activity.swapCount >= expected;
      case "bridge_count":
        return activity.bridgeCount >= expected;
      case "avg_tx_value":
        const avgValue = normalizer.getAvgTxValue(activity);
        return avgValue < BigInt(Math.floor(Number(expected) * 1e18));
      case "holding_period_days":
        return normalizer.getDaysSinceFirstTx(activity) >= expected;
      case "tx_count":
        return activity.events.length >= expected;
      case "first_tx_days_ago":
        const daysAgo = normalizer.getDaysSinceFirstTx(activity);
        if (expected.toString().includes("<=")) {
          return daysAgo <= parseInt(expected.toString().replace("<=", ""));
        }
        return daysAgo >= expected;
      case "tx_count_last_30_days":
        return normalizer.getTxCountLastNDays(activity, 30) >= expected;
      case "unique_protocols":
        return activity.uniqueProtocols.size >= expected;
      default:
        return false;
    }
  }

  /**
   * Calculate multiplier value
   */
  private calculateMultiplier(activity: UserActivity, multiplierExpr: string): number {
    // Simple multiplier expressions like "contract_count" or "holding_period_days / 60"
    if (multiplierExpr === "contract_count") {
      return activity.contractDeployments;
    }
    if (multiplierExpr === "activity_count") {
      return activity.events.length;
    }
    if (multiplierExpr.includes("holding_period_days / 60")) {
      const days = this.normalizer.getDaysSinceFirstTx(activity);
      return days / 60;
    }
    if (multiplierExpr.includes("tx_count_last_30_days / 5")) {
      const count = this.normalizer.getTxCountLastNDays(activity, 30);
      return count / 5;
    }
    return 1;
  }

  /**
   * Apply time decay to score
   */
  private applyTimeDecay(score: number, activity: UserActivity, halfLifeDays: number): number {
    if (!activity.lastTxTimestamp) return 0;

    const daysSinceLastTx = this.normalizer.getDaysSinceLastTx(activity);
    const decayFactor = Math.pow(0.5, daysSinceLastTx / halfLifeDays);
    return Math.floor(score * decayFactor);
  }

  /**
   * Generate explanation for a signal
   */
  private generateExplanation(
    activity: UserActivity,
    signalType: string,
    definition: SignalDefinition
  ): string {
    const normalizer = this.normalizer;
    const days = normalizer.getDaysSinceFirstTx(activity);

    switch (signalType) {
      case "BUILDER_SIGNAL":
        return `You are tagged as BUILDER because you deployed ${activity.contractDeployments} contracts and have been active for ${days} days.`;
      case "FARMER_SIGNAL":
        return `You are tagged as FARMER because you made ${activity.swapCount} swaps and ${activity.bridgeCount} bridges with low average value.`;
      case "LONG_TERM_SIGNAL":
        return `You are tagged as LONG_TERM because you've been active for ${days} days with ${activity.events.length} transactions.`;
      case "ACTIVE_USER_SIGNAL":
        const last30Days = normalizer.getTxCountLastNDays(activity, 30);
        return `You are tagged as ACTIVE_USER because you made ${last30Days} transactions in the last 30 days across ${activity.uniqueProtocols.size} protocols.`;
      case "NEWCOMER_SIGNAL":
        return `You are tagged as NEWCOMER because you joined Base ${days} days ago with ${activity.events.length} transactions.`;
      default:
        return definition.description;
    }
  }

  /**
   * Determine primary intent from signals
   */
  private determinePrimaryIntent(signals: SignalScore[]): string | undefined {
    if (signals.length === 0) return undefined;

    // Sort by score descending
    const sorted = signals.sort((a, b) => b.score - a.score);
    return sorted[0].signalType.replace("_SIGNAL", "").toLowerCase();
  }
}

