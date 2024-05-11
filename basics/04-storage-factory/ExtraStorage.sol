// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage {

    /**
     * Override default function with:
     * number + 10
     * using a virtual override 
     */
    function store(uint256 _favouriteNumber) public override {
        favouriteNumber = _favouriteNumber + 10;
    }
}