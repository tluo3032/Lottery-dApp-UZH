// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    uint public lotteryStartBlock;

    // List of the players - payable modifier in order to receive payment or ether
    address payable[] public players;

    // State variable to store the current round balance
    uint public currentRoundBalance;

    address payable public winnerAddress;
    uint public prizeAmount;

    constructor() {
        // Block number determining the start of the lottery
        lotteryStartBlock = block.number;
    }

    function joinTheLottery() public payable {
        //require(block.number <= lotteryEndBlock, "The lottery has ended");
        require(block.number-lotteryStartBlock<=5,"The lottery has ended");
        require(msg.value > .01 ether, "Minimum bet is 0.01 ether");
        require(!hasUserJoined(msg.sender), "User has already joined the lottery");

        // Add the address who invokes this function to the players array
        players.push(payable(msg.sender));

        // Update the current round balance
        currentRoundBalance += msg.value;

        // Check if 5 players have joined
        /*if (players.length == 5) {
            drawWinner();
        }*/
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
            //drawWinner();

            startNewLottery();
        }
    }

    function getBlockNumber() public view returns (uint) {
        return block.number;
    }

    function collectPrize() public {
        require(amIWinner(), "You are not the winner");
        players[winner()].transfer(address(this).balance);
    }

    function winner() public view returns (uint) {
        require(players.length > 0, "No players in the lottery");
        require(block.number >= lotteryStartBlock, "The lottery has not ended yet");
        uint index = uint(blockhash(lotteryStartBlock));
        return index % players.length;
    }

    function amIWinner() public view returns (bool) {
        return msg.sender == players[winner()];
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function hasLotteryEnded() public view returns (bool) {
        return block.number >= block.number || players.length == 5;
    }

    function getWinnerAddress() public payable{
        uint winnerIndex = winner();
        winnerAddress=payable(players[winnerIndex]);
    }

    function startNewLottery() public {
        require(block.number-lotteryStartBlock>=5,"lottery can only be restart after 5 blocks");
        uint winnerIndex = winner();
        winnerAddress = players[winnerIndex];
        prizeAmount = address(this).balance;

        // Transfer prize to winner
        winnerAddress.transfer(prizeAmount);

        // Reset the lottery
        delete players;
        currentRoundBalance = 0;

        // Set lotteryEndBlock to 5 blocks after the current block
        lotteryStartBlock=block.number;
    }

}