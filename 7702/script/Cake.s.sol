// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {Cake} from "../src/Cake.sol";

contract CakeScript is Script {
    Cake public cake;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        cake = new Cake();
        vm.stopBroadcast();
    }
}
