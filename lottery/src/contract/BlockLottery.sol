// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    uint public lotteryEndBlock;
    uint public nonce;

    address payable[] public players;
    uint public currentRoundBalance;
    mapping(address => bytes32) public commitments;

    address payable public winnerAddress;
    uint public prizeAmount;

    constructor() {
        lotteryEndBlock = block.number + 5;
    }

    function commit(bytes32 _commitment) public {
        require(block.number <= lotteryEndBlock, "The lottery has ended");
        require(commitments[msg.sender] == 0, "User has already joined the lottery");
        commitments[msg.sender] = _commitment;
    }

    function reveal(uint256 _salt) public payable {
        require(block.number > lotteryEndBlock, "The reveal phase has not started yet");
        require(commitments[msg.sender] != 0, "User has not committed");
        require(msg.value > .01 ether, "Minimum bet is 0.01 ether");

        bytes32 expectedCommitment = keccak256(abi.encodePacked(msg.sender, _salt));
        require(commitments[msg.sender] == expectedCommitment, "Invalid reveal");

        players.push(payable(msg.sender));
        currentRoundBalance += msg.value;

        if (players.length == 5) {
            drawWinner();
        }
    }


    function hasUserJoined(address user) private view returns (bool) {
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == user) {
                return true;
            }
        }
        return false;
    }

    function checkAndDrawWinner() private {
        if (hasLotteryEnded()) {
            drawWinner();
        }
    }

    function getBlockNumber() public view returns (uint) {
        return block.number;
    }

    function collectPrize() public {
        require(amIWinner(), "You are not the winner");
        (uint winnerIndex, uint checkedNonce)=winner();
        players[winnerIndex].transfer(address(this).balance);
    }

    function winner() public returns (uint,uint) {
        require(players.length > 0, "No players in the lottery");
        require(block.number >= lotteryEndBlock, "The lottery has not ended yet");
        nonce++;
        bytes32 seed = keccak256(abi.encodePacked(lotteryEndBlock,nonce));
        uint randomNum = uint(keccak256(abi.encode(seed)));
        uint Index = randomNum % players.length;
        return (Index, nonce);
    }

    function amIWinner() public returns (bool) {
        (uint winnerIndex, uint checkedNonce)=winner();
        return msg.sender == players[winnerIndex]&&checkedNonce==nonce;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function hasLotteryEnded() public view returns (bool) {
        return block.number >= lotteryEndBlock || players.length == 5;
    }

    function drawWinner() private {
        (uint winnerIndex, uint checkedNonce)=winner();
        winnerAddress = players[winnerIndex];
        prizeAmount = address(this).balance;

        // Transfer prize to winner
        winnerAddress.transfer(prizeAmount);

        // Reset the lottery
        delete players;
        currentRoundBalance = 0;

        // Set lotteryEndBlock to 5 blocks after the current block
        lotteryEndBlock = block.number + 5;
    }

}
