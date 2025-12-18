// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SignalAttestor} from "../src/SignalAttestor.sol";
import {SignalRegistry} from "../src/SignalRegistry.sol";

/**
 * @title DeployScript
 * @notice Deployment script for BaseSignals contracts
 */
contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying from:", deployer);
        console.log("Balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy SignalAttestor first
        console.log("Deploying SignalAttestor...");
        SignalAttestor attestor = new SignalAttestor();
        console.log("SignalAttestor deployed at:", address(attestor));

        // Deploy SignalRegistry with attestor manager
        console.log("Deploying SignalRegistry...");
        SignalRegistry registry = new SignalRegistry(address(attestor));
        console.log("SignalRegistry deployed at:", address(registry));

        // Add deployer as initial attestor
        console.log("Adding deployer as initial attestor...");
        attestor.addAttestor(deployer);
        console.log("Deployer added as attestor");

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("SignalAttestor:", address(attestor));
        console.log("SignalRegistry:", address(registry));
        console.log("Initial Attestor:", deployer);
    }
}

