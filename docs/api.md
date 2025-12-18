# BaseSignals API Documentation

## Base URL

```
https://api.basesignals.xyz
```

## Endpoints

### GET /address/:addr/signals

Get all signals for an address.

**Parameters:**
- `addr` (path): Base address (0x...)

**Response:**
```json
{
  "address": "0x...",
  "signals": [
    {
      "signalType": "BUILDER_SIGNAL",
      "score": 72,
      "explanation": "You are tagged as BUILDER because...",
      "timestamp": 1234567890
    }
  ],
  "intent": "builder",
  "lastUpdated": 1234567890
}
```

### GET /address/:addr/intent

Get primary intent for an address.

**Parameters:**
- `addr` (path): Base address (0x...)

**Response:**
```json
{
  "address": "0x...",
  "intent": "builder"
}
```

### GET /signal/:type/top

Get top addresses for a signal type.

**Parameters:**
- `type` (path): Signal type (e.g., BUILDER, FARMER)
- `limit` (query, optional): Number of results (default: 10)

**Response:**
```json
[
  {
    "address": "0x...",
    "score": 95
  },
  {
    "address": "0x...",
    "score": 88
  }
]
```

### GET /stats/network

Get network-wide statistics.

**Response:**
```json
{
  "totalAddresses": 1234,
  "signalCounts": {
    "BUILDER_SIGNAL": 456,
    "FARMER_SIGNAL": 234,
    "LONG_TERM_SIGNAL": 123
  },
  "totalSignals": 813
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1234567890
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

