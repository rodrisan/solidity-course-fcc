// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './PriceConverter.sol';

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    address[] public funders;
    address public immutable i_owner;

    mapping(address => uint256) public addressToAmountFunded;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            'You need to spend more ETH!'
        ); // 1e18 =1 * 10 ** 18
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }('');

        require(callSuccess, 'Call failed');
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert NotOwner();
        _;
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }
}
