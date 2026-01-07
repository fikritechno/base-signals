/**
 * BaseSignals Indexer - Main entry point
 */

import "dotenv/config";
import axios from "axios";
import { BaseListener } from "./base-listener.js";
import { EventNormalizer } from "./event-normalizer.js";
import { SignalEngine } from "./signal-engine.js";
import { OnChainAttestor } from "./onchain-attestor.js";
import { UserActivity } from "./types.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const rpcUrl = process.env.BASE_RPC_URL || "https://sepolia.base.org";
  const apiUrl = process.env.API_URL || "http://localhost:3001";
  const privateKey = process.env.PRIVATE_KEY; // Optional: for on-chain attestations
  const signalsFilePath = join(__dirname, "../../signals/definitions.yaml");

  console.log("🚀 Starting BaseSignals Indexer");
  console.log(`RPC URL: ${rpcUrl.replace(/\/v2\/[^/]+/, '/v2/***')}`); // Hide API key in logs
  console.log(`API URL: ${apiUrl}`);
  console.log(`Signals file: ${signalsFilePath}`);
  console.log(`On-chain attestations: ${privateKey ? "Enabled" : "Disabled (no PRIVATE_KEY)"}`);
  
  // Test RPC connection
  try {
    const { ethers } = await import("ethers");
    const testProvider = new ethers.JsonRpcProvider(rpcUrl);
    const blockNumber = await testProvider.getBlockNumber();
    console.log(`✅ RPC connection successful (current block: ${blockNumber})`);
  } catch (error: any) {
    console.error(`❌ RPC connection failed: ${error.message}`);
    console.error(`   Please check your BASE_RPC_URL in .env file`);
    console.error(`   Falling back to public RPC: https://sepolia.base.org`);
    // Don't exit, just use fallback
  }

  const listener = new BaseListener(rpcUrl);
  const normalizer = new EventNormalizer();
  const signalEngine = new SignalEngine(signalsFilePath);
  const onChainAttestor = new OnChainAttestor(rpcUrl, privateKey);

  // Start listening
  await listener.start();

  // Poll for new blocks
  setInterval(async () => {
    try {
      const events = await listener.getNewBlocks();
      if (events.length > 0) {
        console.log(`📦 Processed ${events.length} new events`);

        // Group events by address
        const eventsByAddress = new Map<string, typeof events>();
        for (const event of events) {
          const addr = event.address.toLowerCase();
          if (!eventsByAddress.has(addr)) {
            eventsByAddress.set(addr, []);
          }
          eventsByAddress.get(addr)!.push(event);
        }

        // Generate signals for each address
        for (const [address, addressEvents] of eventsByAddress) {
          const activity = normalizer.buildUserActivity(address, addressEvents);
          const signals = signalEngine.generateSignals(activity);

          if (signals.signals.length > 0) {
            console.log(`✅ Generated ${signals.signals.length} signals for ${address}`);
            console.log(`   Primary intent: ${signals.primaryIntent}`);
            
            // Send to backend API
            try {
              await axios.post(`${apiUrl}/attest`, {
                address,
                signals: signals.signals,
                intent: signals.primaryIntent,
              });
              console.log(`   📤 Sent signals to API for ${address}`);
            } catch (error: any) {
              console.error(`   ❌ Failed to send signals to API for ${address}:`, error.message);
            }

            // Attest on-chain (if private key is configured)
            if (privateKey) {
              await onChainAttestor.attestSignals(address, signals.signals);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing blocks:", error);
    }
  }, 10000); // Poll every 10 seconds

  console.log("✅ Indexer running. Press Ctrl+C to stop.");
}

main().catch(console.error);

