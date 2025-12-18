/**
 * BaseSignals Indexer - Main entry point
 */

import "dotenv/config";
import { BaseListener } from "./base-listener.js";
import { EventNormalizer } from "./event-normalizer.js";
import { SignalEngine } from "./signal-engine.js";
import { UserActivity } from "./types.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const rpcUrl = process.env.BASE_RPC_URL || "https://sepolia.base.org";
  const signalsFilePath = join(__dirname, "../signals/definitions.yaml");

  console.log("🚀 Starting BaseSignals Indexer");
  console.log(`RPC URL: ${rpcUrl}`);
  console.log(`Signals file: ${signalsFilePath}`);

  const listener = new BaseListener(rpcUrl);
  const normalizer = new EventNormalizer();
  const signalEngine = new SignalEngine(signalsFilePath);

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
            // TODO: Send to on-chain registry or API
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

