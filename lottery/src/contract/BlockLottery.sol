//SPDX-License-Identifier: MIT
//There is a problem while calling blockhash on Javascript VM. As an environment, please select Custom-External Http Provider, Ganache.

pragma solidity ^0.8.19;

contract Lottery{
    uint public lottery_over_block;

    //list of the players - payable modifier in order to receive payment or ether
    address payable[] public players;

    constructor() {
        //block number determining the end of the lottery
        lottery_over_block = 5;
    }

    function joinTheLottery() public payable {
        //lottery hasn't finished
        require(block.number < 1+lottery_over_block);
        //player should send some ether to join requirement
        require(msg.value > .01 ether);
        //add the address who invokes this function to the players array 
        players.push(payable(msg.sender));
    }

    function getBlockNumber() public view returns (uint) {
        return block.number;
    }

    function collectPrize() public {
        //transfer the balance of the smart contract to the winner
        players[winner()].transfer(address(this).balance);
    }

    function winner() public view returns (uint) {
        require(block.number >= lottery_over_block);
        //The hash of the block decides the winner.
        uint index = uint(blockhash(lottery_over_block));
        return index % players.length;
    }

    function amIWinner() public view returns (bool) {
        //checks if the interacting account is the winner
        return msg.sender == players[winner()];
    }

    function getBalance() public view returns (uint) {
        //view but not modify the lottery balance
        return address(this).balance;
    }
    
    function getPlayers() public view returns (address payable[] memory){
        //stored temporarily only in the func lifecycle
        return players;
    }

}
