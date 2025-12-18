// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISignalRegistry} from "./interfaces/ISignalRegistry.sol";
import {ISignalAttestor} from "./interfaces/ISignalAttestor.sol";

/**
 * @title SignalRegistry
 * @notice Stores verifiable signal attestations for Base users
 * @dev Only approved attestors can write signals
 */
contract SignalRegistry is ISignalRegistry {
    ISignalAttestor public immutable attestorManager;

    // user => signalType => Signal
    mapping(address => mapping(bytes32 => Signal)) private _signals;
    
    // user => signalTypes[]
    mapping(address => bytes32[]) private _userSignalTypes;

    /**
     * @notice Constructor sets the attestor manager
     * @param _attestorManager Address of the SignalAttestor contract
     */
    constructor(address _attestorManager) {
        require(_attestorManager != address(0), "SignalRegistry: zero address");
        attestorManager = ISignalAttestor(_attestorManager);
    }

    /**
     * @notice Attest a signal for a user
     * @param user The address to attest a signal for
     * @param signalType The type of signal (e.g. keccak256("BUILDER"))
     * @param score The signal score (0-100)
     */
    function attestSignal(
        address user,
        bytes32 signalType,
        uint256 score
    ) external override {
        require(user != address(0), "SignalRegistry: zero address");
        require(score <= 100, "SignalRegistry: score exceeds 100");
        require(
            attestorManager.isAttestor(msg.sender),
            "SignalRegistry: not an attestor"
        );

        // If signal doesn't exist, add to user's signal types list
        if (_signals[user][signalType].timestamp == 0) {
            _userSignalTypes[user].push(signalType);
        }

        _signals[user][signalType] = Signal({
            signalType: signalType,
            score: score,
            timestamp: block.timestamp,
            attestor: msg.sender
        });

        emit SignalAttested(user, signalType, score, msg.sender, block.timestamp);
    }

    /**
     * @notice Revoke a signal for a user
     * @param user The address to revoke a signal for
     * @param signalType The type of signal to revoke
     */
    function revokeSignal(address user, bytes32 signalType) external override {
        require(
            attestorManager.isAttestor(msg.sender),
            "SignalRegistry: not an attestor"
        );
        require(_signals[user][signalType].timestamp != 0, "SignalRegistry: signal not found");

        delete _signals[user][signalType];

        // Remove from user's signal types list
        bytes32[] storage signalTypes = _userSignalTypes[user];
        for (uint256 i = 0; i < signalTypes.length; i++) {
            if (signalTypes[i] == signalType) {
                signalTypes[i] = signalTypes[signalTypes.length - 1];
                signalTypes.pop();
                break;
            }
        }

        emit SignalRevoked(user, signalType, msg.sender, block.timestamp);
    }

    /**
     * @notice Get all signals for a user
     * @param user The address to query
     * @return signals Array of Signal structs
     */
    function getSignals(address user) external view override returns (Signal[] memory) {
        bytes32[] memory signalTypes = _userSignalTypes[user];
        Signal[] memory signals = new Signal[](signalTypes.length);
        
        for (uint256 i = 0; i < signalTypes.length; i++) {
            signals[i] = _signals[user][signalTypes[i]];
        }
        
        return signals;
    }

    /**
     * @notice Get a specific signal score for a user
     * @param user The address to query
     * @param signalType The type of signal
     * @return score The signal score (0 if not found)
     */
    function getSignalScore(address user, bytes32 signalType) external view override returns (uint256) {
        return _signals[user][signalType].score;
    }

    /**
     * @notice Check if a user has a specific signal
     * @param user The address to query
     * @param signalType The type of signal
     * @return exists True if signal exists
     */
    function hasSignal(address user, bytes32 signalType) external view override returns (bool) {
        return _signals[user][signalType].timestamp != 0;
    }
}

