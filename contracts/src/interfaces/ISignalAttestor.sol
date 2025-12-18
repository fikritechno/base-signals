// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ISignalAttestor
 * @notice Interface for managing signal attestors
 */
interface ISignalAttestor {
    /**
     * @notice Emitted when an attestor is added
     */
    event AttestorAdded(address indexed attestor, address indexed addedBy);

    /**
     * @notice Emitted when an attestor is removed
     */
    event AttestorRemoved(address indexed attestor, address indexed removedBy);

    /**
     * @notice Check if an address is an approved attestor
     * @param attestor The address to check
     * @return isAttestor True if the address is an approved attestor
     */
    function isAttestor(address attestor) external view returns (bool isAttestor);

    /**
     * @notice Add an attestor (only admin)
     * @param attestor The address to add as an attestor
     */
    function addAttestor(address attestor) external;

    /**
     * @notice Remove an attestor (only admin)
     * @param attestor The address to remove as an attestor
     */
    function removeAttestor(address attestor) external;
}

