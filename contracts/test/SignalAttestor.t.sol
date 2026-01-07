// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {SignalAttestor} from "../src/SignalAttestor.sol";

contract SignalAttestorTest is Test {
    SignalAttestor public attestor;
    
    address public admin = address(1);
    address public attestor1 = address(2);
    address public attestor2 = address(3);

    function setUp() public {
        vm.prank(admin);
        attestor = new SignalAttestor();
    }

    function test_Deploy() public {
        assertEq(attestor.owner(), admin);
    }

    function test_AddAttestor() public {
        vm.prank(admin);
        attestor.addAttestor(attestor1);
        
        bool isAttestor = attestor.isAttestor(attestor1);
        assertTrue(isAttestor);
    }

    function test_AddAttestor_NotOwner() public {
        vm.prank(attestor1);
        vm.expectRevert();
        attestor.addAttestor(attestor2);
    }

    function test_AddAttestor_ZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert("SignalAttestor: zero address");
        attestor.addAttestor(address(0));
    }

    function test_RemoveAttestor() public {
        vm.startPrank(admin);
        attestor.addAttestor(attestor1);
        attestor.removeAttestor(attestor1);
        vm.stopPrank();
        
        bool isAttestor = attestor.isAttestor(attestor1);
        assertFalse(isAttestor);
    }

    function test_RemoveAttestor_NotAttestor() public {
        vm.prank(admin);
        vm.expectRevert("SignalAttestor: not an attestor");
        attestor.removeAttestor(attestor1);
    }
}

