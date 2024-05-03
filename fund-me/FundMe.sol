// GEt funds from users
// Withdraw funds
// Set a minimum value in USD

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PriceConverter.sol";

// Import from Github OR NPM

// Transaction cost: 632328 gas
// Making it gas efficient: use constant, inmutable
// after making minimumUsd as constant: 612395 gas

contract FundMe {
    using PriceConverter for uint256;

    // uint256 public minimumUsd = 50 * 1e18; // 1 * 10 ** 18
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    // 2446 gas as public no constant
    // 347 gas as constant

    address[] public funders;

    // Immutable
    address public immutable i_owner;
    // Gas 2574 gas non immutable
    // Gas: 439 gas as immutable

    mapping(address => uint256) public addressToAmountFunded;

    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        // Want to be able to set minimum amount in USD
        // 1. How to send ETH to this contract
        // msg.value

        /**
         * This project will use Oracles:
         * ChainLink Data Feeds
         * https://data.chain.link/feeds/ethereum/mainnet/eth-usd
         * https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1&search=eth
         *
         * Chainlink VRF (Verifiable Random Function)
         * https://docs.chain.link/vrf/
         *
         * Chainlink Keepers (now called Chainlink Automations)
         * Descentralised Event Drive Execution
         */

        // Any previous process is undone.
        // getConversionRate(msg.value) is equivalent to msg.value.getConversionRate()
        require(msg.value.getConversionRate() >= MINIMUM_USD, "You need to spend more ETH!"); // 1e18 =1 * 10 ** 18
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for(uint256 funderIndex = 0; funderIndex <funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        // Reset the array
        funders = new address[](0);

        // Withdraw the funds:

        // msg.sender = address
        // payable(msg.sender) = payable address

        // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // (2300 gas, throws error)

        // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // (2300 gas, returns bool)

        // call - Recommended way to do it!
        // (bool callSuccess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}("");
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
        // (forward all gas or set gas, returns bool)
    }

    modifier onlyOwner {
        require(msg.sender == i_owner, "Sender is not owner!");
        _;
    }
}
