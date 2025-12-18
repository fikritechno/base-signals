/**
 * BaseSignals JavaScript SDK
 */

import axios, { AxiosInstance } from "axios";

export interface Signal {
  signalType: string;
  score: number;
  explanation: string;
  timestamp: number;
}

export interface UserSignals {
  address: string;
  signals: Signal[];
  intent?: string;
  lastUpdated: number;
}

export interface BaseSignalsConfig {
  apiUrl?: string;
}

export class BaseSignals {
  private api: AxiosInstance;

  constructor(config: BaseSignalsConfig = {}) {
    const apiUrl = config.apiUrl || "https://api.basesignals.xyz";
    this.api = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
    });
  }

  /**
   * Get all signals for an address
   */
  async getSignals(address: string): Promise<UserSignals> {
    const response = await this.api.get(`/address/${address}/signals`);
    return response.data;
  }

  /**
   * Get primary intent for an address
   */
  async getPrimaryIntent(address: string): Promise<string | null> {
    const response = await this.api.get(`/address/${address}/intent`);
    return response.data.intent;
  }

  /**
   * Get top addresses for a signal type
   */
  async getTopSignals(signalType: string, limit: number = 10): Promise<Array<{ address: string; score: number }>> {
    const response = await this.api.get(`/signal/${signalType}/top`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<{
    totalAddresses: number;
    signalCounts: Record<string, number>;
    totalSignals: number;
  }> {
    const response = await this.api.get("/stats/network");
    return response.data;
  }
}

