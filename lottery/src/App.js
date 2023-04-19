import './styles/App.css';
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, TextField, ThemeProvider } from "@mui/material";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import { createTheme } from "@mui/material";
import web3 from './web3';


function App() {
    const [walletAddress, setWalletAddress] = useState();
    const [inputContractAddress, setInputContractAddress] = useState("");
    const [lotteryContract, setLotteryContract] = useState();
    const [betNumber, setBetNumber] = useState(0);
    const [balance, setBalance] = useState(0);
    const [accounts, setAccounts] = useState([]);



    const theme = createTheme({
        palette: {
            primary: {
                main: 'rgba(234,173,41,0.87)',
                darker: 'rgba(239,180,50,0.91)'
            },
        }
    });

    const loadContract = async () => {
        const provider = await detectEthereumProvider();
        if (provider) {
            const web3 = new Web3(provider);
            // todo: abi copied from remix
            const abi = [
                {
                    "inputs": [],
                    "name": "collectPrize",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "joinTheLottery",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "amIWinner",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "currentRoundBalance",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getBalance",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getBlockNumber",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getPlayers",
                    "outputs": [
                        {
                            "internalType": "address payable[]",
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "lottery_over_block",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "players",
                    "outputs": [
                        {
                            "internalType": "address payable",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "winner",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ];
            const contract = new web3.eth.Contract(abi);
            contract.options.address = inputContractAddress; // Set the address before setting the state
            setLotteryContract(contract);
            console.log('Contract address:', contract.options.address);
            console.log('Loaded contract:', contract);
        } else {
            console.log("MetaMask is not installed");
        }
    };



    async function fetchBalance() {
        try {
            if (lotteryContract && lotteryContract.options.address) {
                const currentBalance = await lotteryContract.methods.getBalance().call();
                setBalance(web3.utils.fromWei(currentBalance, 'ether'));
            } else {
                console.log("Lottery contract is not loaded or doesn't have an address set");
            }
        } catch (err) {
            console.error("Error fetching balance:", err);
        }
    }


    useEffect(() => {
        async function loadAccounts() {
            try {
                const loadedAccounts = await web3.eth.getAccounts();
                setAccounts(loadedAccounts);
            } catch (err) {
                console.error("Error loading accounts:", err);
            }
        }

        if (web3) {
            loadAccounts();
        }
    }, [web3]);



    const connectWallet = async () => {
        const provider = await detectEthereumProvider();
        if (provider) {
            console.log("MetaMask is installed!");
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = accounts[0];
            setWalletAddress(account);
        } else {
            console.log("MetaMask is not installed");
        }
    };

    const handleSetNumber = (value) => {
        setBetNumber(value);
    }

    async function handleJoinLottery() {
        if (!lotteryContract) {
            console.log("Lottery contract is not loaded or doesn't have an address set");
            return;
        }

        const accounts = await web3.eth.getAccounts();
        const options = {
            from: accounts[0]
        };

        await lotteryContract.methods.joinTheLottery().send(options);
        fetchBalance();
    }







    return (
        <div className="main">
            <div className="body">
                <div className="title">
                    BlockLottery
                </div>
                <div className="two-column-grid">
                    <div className="left-column">
                        <div className="info">
                            <div className="info-text">JOIN THE LOTTERY</div>
                            <div className="info-text-detail">Lottery game that generates winner by block</div>
                            <div className="buttonfield">
                                <ThemeProvider theme={theme}>
                                    <Button onClick={connectWallet} variant={"contained"} color='primary'>Connect Wallet</Button>
                                </ThemeProvider>
                            </div>
                            {walletAddress && <div className={"account"}>
                                <h6>Your account address:<br />
                                    {walletAddress}</h6>
                            </div>}
                        </div>

                        <div className="interaction">
                            <TextField
                                id="outlined-lottery-contract-address"
                                label="Lottery Contract Address"
                                value={inputContractAddress}
                                onChange={(e) => setInputContractAddress(e.target.value)}
                            />
                            <Button onClick={loadContract} variant={"contained"}>Load Contract</Button>

                            <div className="field">
                                <TextField
                                    id="outlined-number"
                                    value={betNumber}
                                    label="Ether"
                                    type="ether"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => handleSetNumber(e.target.value)}
                                />

                                <div className="buttonfield">
                                    <ThemeProvider theme={theme}>
                                        <Button onClick={handleJoinLottery} variant={"contained"} >Join The Lottery</Button>
                                    </ThemeProvider>
                                </div>
                            </div>

                            <h3>The balance of this round:</h3>
                            <h2><div>
                                Current Lottery Balance: {balance} ETH
                            </div></h2>

                            <div className="buttonfield">
                                <Button variant={"outlined"} color={"warning"}>Collect</Button>
                            </div>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="players">
                            <h3>playerlist</h3>
                            <div className="buttonfield">
                                <Button variant={"contained"} color="warning">Get Winner</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default App;