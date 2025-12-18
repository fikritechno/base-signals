# Sybil Resistance

BaseSignals helps identify and resist Sybil attacks through behavioral analysis.

## How It Works

### FARMER_SIGNAL

The FARMER_SIGNAL specifically targets airdrop farming behavior:
- Frequent small swaps
- Multiple bridge transactions
- Low average transaction value
- Short-term activity patterns

### Behavioral Patterns

Sybil accounts typically exhibit:
1. **Low-value transactions**: Many small swaps/bridges
2. **Short activity windows**: Active only during airdrop periods
3. **Limited protocol diversity**: Interact with few protocols
4. **No contract deployments**: Don't build anything

### Long-term Signals

Genuine users often have:
- **LONG_TERM_SIGNAL**: Active for 60+ days
- **BUILDER_SIGNAL**: Deploy contracts
- **ACTIVE_USER_SIGNAL**: Regular, diverse activity

## Usage in Protocols

Protocols can use BaseSignals to:
1. **Filter farmers**: Exclude addresses with high FARMER_SIGNAL scores
2. **Reward builders**: Prioritize addresses with BUILDER_SIGNAL
3. **Identify long-term users**: Weight LONG_TERM_SIGNAL in governance

## Limitations

BaseSignals is not a complete Sybil resistance solution:
- Behavioral signals can be gamed
- Should be combined with other methods
- Requires ongoing refinement

## Best Practices

1. **Combine signals**: Don't rely on a single signal
2. **Use thresholds**: Set minimum scores for eligibility
3. **Monitor patterns**: Update signal definitions as needed
4. **Community input**: Allow community to flag suspicious behavior

