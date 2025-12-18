// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {SignalAttestor} from "../src/SignalAttestor.sol";
import {SignalRegistry} from "../src/SignalRegistry.sol";

contract SignalRegistryTest is Test {
    SignalAttestor public attestor;
    SignalRegistry public registry;
    
    address public admin = address(1);
    address public attestor1 = address(2);
    address public user1 = address(3);
    
    bytes32 public constant BUILDER_SIGNAL = keccak256("BUILDER");
    bytes32 public constant FARMER_SIGNAL = keccak256("FARMER");

    function setUp() public {
        vm.startPrank(admin);
        attestor = new SignalAttestor();
        registry = new SignalRegistry(address(attestor));
        
        // Add admin as attestor
        attestor.addAttestor(admin);
        vm.stopPrank();
    }

    function test_Deploy() public {
        assertEq(address(registry.attestorManager()), address(attestor));
    }

    function test_AttestSignal() public {
        vm.prank(admin);
        registry.attestSignal(user1, BUILDER_SIGNAL, 75);
        
        uint256 score = registry.getSignalScore(user1, BUILDER_SIGNAL);
        assertEq(score, 75);
        
        bool hasSignal = registry.hasSignal(user1, BUILDER_SIGNAL);
        assertTrue(hasSignal);
    }

    function test_AttestSignal_NotAttestor() public {
        vm.prank(attestor1);
        vm.expectRevert("SignalRegistry: not an attestor");
        registry.attestSignal(user1, BUILDER_SIGNAL, 75);
    }

    function test_AttestSignal_ScoreExceeds100() public {
        vm.prank(admin);
        vm.expectRevert("SignalRegistry: score exceeds 100");
        registry.attestSignal(user1, BUILDER_SIGNAL, 101);
    }

    function test_GetSignals() public {
        vm.startPrank(admin);
        registry.attestSignal(user1, BUILDER_SIGNAL, 75);
        registry.attestSignal(user1, FARMER_SIGNAL, 30);
        vm.stopPrank();
        
        ISignalRegistry.Signal[] memory signals = registry.getSignals(user1);
        assertEq(signals.length, 2);
    }

    function test_RevokeSignal() public {
        vm.startPrank(admin);
        registry.attestSignal(user1, BUILDER_SIGNAL, 75);
        registry.revokeSignal(user1, BUILDER_SIGNAL);
        vm.stopPrank();
        
        bool hasSignal = registry.hasSignal(user1, BUILDER_SIGNAL);
        assertFalse(hasSignal);
        
        uint256 score = registry.getSignalScore(user1, BUILDER_SIGNAL);
        assertEq(score, 0);
    }

    function test_UpdateSignal() public {
        vm.startPrank(admin);
        registry.attestSignal(user1, BUILDER_SIGNAL, 50);
        uint256 score1 = registry.getSignalScore(user1, BUILDER_SIGNAL);
        assertEq(score1, 50);
        
        registry.attestSignal(user1, BUILDER_SIGNAL, 80);
        uint256 score2 = registry.getSignalScore(user1, BUILDER_SIGNAL);
        assertEq(score2, 80);
        vm.stopPrank();
    }
}

