// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {Cake} from "../src/Cake.sol";

contract CakeTest is Test {
    Cake public cake;

    function setUp() public {
        cake = new Cake();
    }

}
