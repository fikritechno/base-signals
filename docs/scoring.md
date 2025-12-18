# Signal Scoring System

## Overview

BaseSignals uses a transparent scoring system to quantify user behavior. Scores range from 0-100, where higher scores indicate stronger signals.

## Score Calculation

### Base Score

Each signal type has a base score that represents the minimum score when conditions are met.

### Multipliers

Multipliers increase the score based on activity intensity:
- `contract_count`: Number of contracts deployed
- `activity_count`: Total number of transactions
- `holding_period_days / 60`: Days active divided by 60
- `tx_count_last_30_days / 5`: Recent transactions divided by 5

### Time Decay

Some signals decay over time to prioritize recent activity:
- Formula: `score * (0.5 ^ (days_since_last_tx / half_life_days))`
- Signals with time decay: BUILDER, FARMER, ACTIVE_USER, NEWCOMER
- Signals without time decay: LONG_TERM

### Maximum Score

Each signal type has a maximum score cap to prevent outliers.

## Example Calculations

### BUILDER_SIGNAL

- Base: 50
- User deployed 5 contracts
- Multiplier: 5
- Score: 50 * 5 = 250 → capped at 100

### LONG_TERM_SIGNAL

- Base: 30
- User active for 120 days
- Multiplier: 120 / 60 = 2
- Score: 30 * 2 = 60

### ACTIVE_USER_SIGNAL

- Base: 20
- User made 15 transactions in last 30 days
- Multiplier: 15 / 5 = 3
- Score: 20 * 3 = 60
- Time decay: Last tx 10 days ago, half-life 30 days
- Final: 60 * (0.5 ^ (10/30)) = 60 * 0.79 = 47

## Transparency

All scoring rules are:
- Defined in `signals/definitions.yaml`
- Open source
- Explainable (each signal includes explanation)
- Auditable

