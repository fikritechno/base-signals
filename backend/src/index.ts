/**
 * BaseSignals Backend API
 */

import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock data store (in production, use a database)
const signalsStore = new Map<string, any>();

/**
 * GET /address/:addr/signals
 * Get all signals for an address
 */
app.get("/address/:addr/signals", async (req, res) => {
  try {
    const address = req.params.addr.toLowerCase();
    
    // In production, fetch from database or on-chain
    const signals = signalsStore.get(address) || {
      address,
      signals: [],
      intent: null,
      lastUpdated: Date.now(),
    };

    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /address/:addr/intent
 * Get primary intent for an address
 */
app.get("/address/:addr/intent", async (req, res) => {
  try {
    const address = req.params.addr.toLowerCase();
    const data = signalsStore.get(address);
    
    res.json({
      address,
      intent: data?.intent || null,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /signal/:type/top
 * Get top addresses for a signal type
 */
app.get("/signal/:type/top", async (req, res) => {
  try {
    const signalType = req.params.type.toUpperCase();
    const limit = parseInt(req.query.limit as string) || 10;

    // In production, query database
    const top: any[] = [];
    
    for (const [address, data] of signalsStore.entries()) {
      const signal = data.signals?.find((s: any) => s.signalType === signalType);
      if (signal) {
        top.push({
          address,
          score: signal.score,
        });
      }
    }

    top.sort((a, b) => b.score - a.score);
    res.json(top.slice(0, limit));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /stats/network
 * Get network-wide statistics
 */
app.get("/stats/network", async (req, res) => {
  try {
    const stats = {
      totalAddresses: signalsStore.size,
      signalCounts: {} as Record<string, number>,
      totalSignals: 0,
    };

    for (const data of signalsStore.values()) {
      if (data.signals) {
        for (const signal of data.signals) {
          stats.signalCounts[signal.signalType] = 
            (stats.signalCounts[signal.signalType] || 0) + 1;
          stats.totalSignals++;
        }
      }
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /attest (internal)
 * Attest a signal (called by indexer)
 */
app.post("/attest", async (req, res) => {
  try {
    const { address, signals, intent } = req.body;
    
    if (!address || !signals) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const normalizedAddress = address.toLowerCase();
    signalsStore.set(normalizedAddress, {
      address: normalizedAddress,
      signals,
      intent,
      lastUpdated: Date.now(),
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`🚀 BaseSignals API running on port ${PORT}`);
});

