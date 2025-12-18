// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISignalAttestor} from "./interfaces/ISignalAttestor.sol";

/**
 * @title SignalAttestor
 * @notice Manages who can attest signals to the SignalRegistry
 * @dev Allows community attestors to be added/removed by admin
 */
contract SignalAttestor is ISignalAttestor, Ownable {
    mapping(address => bool) private _attestors;

    /**
     * @notice Constructor sets the deployer as the initial owner
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Check if an address is an approved attestor
     * @param attestor The address to check
     * @return isAttestor True if the address is an approved attestor
     */
    function isAttestor(address attestor) external view override returns (bool) {
        return _attestors[attestor];
    }

    /**
     * @notice Add an attestor (only owner)
     * @param attestor The address to add as an attestor
     */
    function addAttestor(address attestor) external override onlyOwner {
        require(attestor != address(0), "SignalAttestor: zero address");
        require(!_attestors[attestor], "SignalAttestor: already an attestor");
        
        _attestors[attestor] = true;
        emit AttestorAdded(attestor, msg.sender);
    }

    /**
     * @notice Remove an attestor (only owner)
     * @param attestor The address to remove as an attestor
     */
    function removeAttestor(address attestor) external override onlyOwner {
        require(_attestors[attestor], "SignalAttestor: not an attestor");
        
        _attestors[attestor] = false;
        emit AttestorRemoved(attestor, msg.sender);
    }
}

