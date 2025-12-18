// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ISignalRegistry
 * @notice Interface for the Signal Registry contract
 */
interface ISignalRegistry {
    struct Signal {
        bytes32 signalType;      // e.g. BUILDER, FARMER, LONG_TERM
        uint256 score;           // strength of signal (0-100)
        uint256 timestamp;       // when signal was attested
        address attestor;        // who attested this signal
    }

    /**
     * @notice Emitted when a signal is attested
     */
    event SignalAttested(
        address indexed user,
        bytes32 indexed signalType,
        uint256 score,
        address indexed attestor,
        uint256 timestamp
    );

    /**
     * @notice Emitted when a signal is revoked
     */
    event SignalRevoked(
        address indexed user,
        bytes32 indexed signalType,
        address indexed attestor,
        uint256 timestamp
    );

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
    ) external;

    /**
     * @notice Revoke a signal for a user
     * @param user The address to revoke a signal for
     * @param signalType The type of signal to revoke
     */
    function revokeSignal(address user, bytes32 signalType) external;

    /**
     * @notice Get all signals for a user
     * @param user The address to query
     * @return signals Array of Signal structs
     */
    function getSignals(address user) external view returns (Signal[] memory signals);

    /**
     * @notice Get a specific signal score for a user
     * @param user The address to query
     * @param signalType The type of signal
     * @return score The signal score (0 if not found)
     */
    function getSignalScore(address user, bytes32 signalType) external view returns (uint256 score);

    /**
     * @notice Check if a user has a specific signal
     * @param user The address to query
     * @param signalType The type of signal
     * @return exists True if signal exists
     */
    function hasSignal(address user, bytes32 signalType) external view returns (bool exists);
}

