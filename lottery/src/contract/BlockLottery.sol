// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    uint public lotteryEndBlock;
    uint public nonce;


    // List of the players - payable modifier in order to receive payment or ether
    address payable[] public players;

    // State variable to store the current round balance
    uint public currentRoundBalance;

    address payable public winnerAddress;
    uint public prizeAmount;

    constructor() {
        // Block number determining the end of the lottery
        lotteryEndBlock = block.number+5;
    }

    function joinTheLottery() public payable {
        require(block.number <= lotteryEndBlock, "The lottery has ended");
        require(msg.value > .01 ether, "Minimum bet is 0.01 ether");
        require(!hasUserJoined(msg.sender), "User has already joined the lottery");

        // Add the address who invokes this function to the players array
        players.push(payable(msg.sender));

        // Update the current round balance
        currentRoundBalance += msg.value;

        // Check if 5 players have joined
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

    function getWinnerAddress() public view returns(address){
        require(winnerAddress!=address(0),"No winner yet");
        return winnerAddress;
    }
}