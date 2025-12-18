"use client";

import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Home() {
  const [address, setAddress] = useState("");
  const [signals, setSignals] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchSignals = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/address/${address}/signals`);
      setSignals(response.data);
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">BaseSignals</h1>
        <p className="text-gray-600 mb-8">
          On-chain behavioral signals & intent graph for Base users
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Address Explorer</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Base address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              onClick={fetchSignals}
              disabled={loading || !address}
              className="px-6 py-2 bg-base-blue text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        {signals && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Signals</h2>
            {signals.signals && signals.signals.length > 0 ? (
              <div className="space-y-4">
                {signals.signals.map((signal: any, idx: number) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{signal.signalType}</span>
                      <span className="text-base-blue font-bold">
                        Score: {signal.score}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{signal.explanation}</p>
                  </div>
                ))}
                {signals.intent && (
                  <div className="mt-4 p-4 bg-base-blue/10 rounded-lg">
                    <p className="font-semibold">Primary Intent: {signals.intent}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No signals found for this address.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

