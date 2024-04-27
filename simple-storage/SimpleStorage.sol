// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// EVM: Ethereum Virtual Machine
// Avalanche, Fanthom, Polygon also works with EVM.

contract SimpleStorage {
    // Functions: public, private, external, internal

    // In no visibility added, it will be internal by default.
    // Without initalising it's value is 0.
    uint256 public favouriteNumber; // Making it public, it generates a getter.
    // bool, string, bytes32

    /* People public person = People({
        favouriteNumber: 2,
        name: "Rod"
    }); */

    // Types
    struct People {
        uint256 favouriteNumber;
        string name;
    }
    
    // People[3] public people; // Limited
    People[] public people; // Dynamic

    // Hash table.
    mapping(string => uint256) public nameToFavouriteNumber; // Is a list.

    function store(uint256 _favouriteNumber) public {
        favouriteNumber = _favouriteNumber;
    }

    // view, pure: can't modify the state.
    function retrieve() public view returns (uint256) {
        return favouriteNumber;
    }

    // calldata: non-modifiable - non-persistent
    // memory: temporary, only exists on the duration of the function.
    // storage: permanent, stay forever.
    function addPerson(string memory _name, uint256 _favouriteNumber) public{
        people.push(People(_favouriteNumber, _name));
        nameToFavouriteNumber[_name] = _favouriteNumber;
    }
}

// A Contract address: 0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d