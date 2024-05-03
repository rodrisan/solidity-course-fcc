// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// This only works right now with Remix IDE.
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

library PriceConverter {
    function getPrice () public view returns(uint256)  {
        // ABI
        // Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306 (Sepolia)
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);

        // (uint roundId, int price, uint startedAt, uint timeStamp, uint80 answerInRound) = priceFeed.latestRoundData();
        (,int256 price,,,) = priceFeed.latestRoundData();

        // Price of ETH in terms of USD
        // Casted to uint256
        return uint256(price * 1e10); // 1**10 == 10000000000
    }

    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        return priceFeed.version();
    }

    function getConversionRate(uint256 ethAmount) public view returns (uint256) {
        uint256 ethPrice = getPrice();
        // 3000_000000000000000000 = ETH / USD price
        // 1_000000000000000000 ETH


        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        // uint256 ethAmountInUsd = ethPrice.mul(ethAmount).div(1e18);
        // 3000
        return ethAmountInUsd;
    }
}