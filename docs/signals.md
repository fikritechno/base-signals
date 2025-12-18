# Signal Definitions

BaseSignals uses transparent, YAML-based signal definitions to detect user behavior on Base.

## Signal Types

### BUILDER_SIGNAL

Detects users who deploy and interact with smart contracts.

**Conditions:**
- Contract deployments >= 3
- Active days >= 14

**Scoring:**
- Base: 50
- Multiplier: contract_count
- Max: 100
- Time decay: 90 days half-life

### FARMER_SIGNAL

Identifies airdrop farming behavior (frequent small swaps, bridges).

**Conditions:**
- Small swaps count >= 10
- Bridge count >= 5
- Average transaction value < 0.01 ETH

**Scoring:**
- Base: 30
- Multiplier: activity_count
- Max: 80
- Time decay: 30 days half-life

### LONG_TERM_SIGNAL

Recognizes long-term participants in Base ecosystem.

**Conditions:**
- Holding period days >= 60
- Transaction count >= 10
- First transaction >= 60 days ago

**Scoring:**
- Base: 30
- Multiplier: holding_period_days / 60
- Max: 100
- Time decay: Disabled

### ACTIVE_USER_SIGNAL

Active engagement on Base (regular transactions).

**Conditions:**
- Transaction count (last 30 days) >= 5
- Unique protocols >= 2

**Scoring:**
- Base: 20
- Multiplier: tx_count_last_30_days / 5
- Max: 70
- Time decay: 30 days half-life

### NEWCOMER_SIGNAL

New users to the Base ecosystem.

**Conditions:**
- First transaction <= 7 days ago
- Transaction count >= 1

**Scoring:**
- Base: 10
- Multiplier: tx_count
- Max: 30
- Time decay: 7 days half-life

## How Signals Work

1. **Event Collection**: Indexer collects on-chain events
2. **Normalization**: Events are normalized into standard format
3. **Activity Building**: User activity is aggregated
4. **Signal Generation**: Signal engine evaluates conditions and calculates scores
5. **On-chain Attestation**: Signals are attested on-chain via SignalRegistry

## Transparency

All signal definitions are:
- Defined in YAML (`signals/definitions.yaml`)
- Open source and auditable
- Forkable and customizable
- Explainable (each signal includes explanation)

