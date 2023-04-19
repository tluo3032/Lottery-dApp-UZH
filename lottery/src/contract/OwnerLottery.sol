//SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

contract Lottery{
    //person who deploy the contract - owner
    address public owner;
    //list of the players - payable modifier in order to receive payment or ether
    address payable[] public players;

    constructor() {
        //the way that we get the address who deployed the contract
        owner=msg.sender;
    }

    function joinTheLottery() public payable {
        //player should send some ether to join requirement
        require(msg.value > .01 ether);

        //add the address who invokes this function to the players array 
        players.push(payable(msg.sender));
    }

    function getRandomNumber() public view returns(uint) {
        //hash the concatation of the owner address and the block timestamp
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function pickWinner() public {
        require(msg.sender == owner);

        //randomly choose a winner from players array
        uint index = getRandomNumber() % players.length;
       
        //transfer the balance of the smart contract to the winner
        players[index].transfer(address(this).balance);

        //reset the array for the next round
        players = new address payable[](0);
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
