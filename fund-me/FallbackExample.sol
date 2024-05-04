// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FallbackExample {
    uint256 public result;

    // send calldata with 0x00
    // Without this method, callback 0x00 fails
    fallback() external payable {
        result = 2;
    }

    // runs when calldata is empty
    receive() external payable {
        result = 1;
    }
}