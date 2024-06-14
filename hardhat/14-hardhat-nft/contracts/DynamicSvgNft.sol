// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import 'base64-sol/base64.sol';

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private i_lowImageURI;
    string private i_highImageURI;
    string private constant BASE64_ENCODED_SVG_PREFIX = 'data:image/svg+xml;base63,';

    constructor(string memory lowSvg, string memory highSvg) ERC721('Dynamic SVG NFT', 'RDNFT') {
        s_tokenCounter = 0;
        i_lowImageURI = svgToImageURI(lowSvg);
        i_highImageURI = svgToImageURI(highSvg);
    }

    function svgToImageURI(string memory svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        // ^0.8.12+ : string.concat(stringA, stringB) // Cool!
        return string(abi.encodePacked(BASE64_ENCODED_SVG_PREFIX, svgBase64Encoded));
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
    }

    function _baseURI() internal pure override returns (string memory) {
        // SVG prefix:  data:image/svg+xml;base64,
        // JSON prefix: data:application/json;base64,
        return 'data:application/json;base64,';
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'URI query for nonexistent token');
        string memory imageURI = 'test';

        return string(
            abi.encodePacked(
                _baseURI(),
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            name(),
                            '", "description": "NFT that changes based on the ChainLink feed"',
                            '"attributes": [{"trait_type": "coolness", "value": 100, "image": "',
                            imageURI,
                            '"}]'
                        )
                    )
                )
            )
        );
    }
}
