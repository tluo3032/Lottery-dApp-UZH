import './styles/App.css';
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, TextField, ThemeProvider } from "@mui/material";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import { createTheme } from "@mui/material";
import web3 from './web3';
import abi from './abi';


function App() {
    const [walletAddress, setWalletAddress] = useState();
    const [inputContractAddress, setInputContractAddress] = useState("");
    const [lotteryContract, setLotteryContract] = useState();
    const [betNumber, setBetNumber] = useState(0);
    const [balance, setBalance] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const [players, setPlayers] = useState([]);
    const [lotteryEnded, setLotteryEnded] = useState(false);
    const [winnerAddress, setWinnerAddress]=useState("");


    const theme = createTheme({
        palette: {
            primary: {
                main: 'rgba(234,173,41,0.87)',
                darker: 'rgba(239,180,50,0.91)'
            },
        }
    });

    async function fetchPlayers() {
        try {
            if (lotteryContract && lotteryContract.options.address) {
                const fetchedPlayers = await lotteryContract.methods.getPlayers().call();
                setPlayers(fetchedPlayers);
            } else {
                console.log("Lottery contract is not loaded or doesn't have an address set");
            }
        } catch (err) {
            console.error("Error fetching players:", err);
        }
    }

    const loadContract = async () => {
        const provider = await detectEthereumProvider();
        if (provider) {
            const web3 = new Web3(provider);
            const abi = require('./abi');
            const contract = new web3.eth.Contract(abi);
            contract.options.address = inputContractAddress; // Set the address before setting the state
            setLotteryContract(contract);
            console.log('Contract address:', contract.options.address);
            console.log('Loaded contract:', contract);
        } else {
            console.log("MetaMask is not installed");
        }
        await fetchPlayers();
        await fetchWinnerAddress();
        await fetchWinnerAddress();
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

    async function hasLotteryEnded() {
        try {
            if (lotteryContract && lotteryContract.options.address) {
                const currentBlockNumber = await web3.eth.getBlockNumber();
                const lotteryOverBlock = await lotteryContract.methods.getLotteryEndBlock().call();
                setLotteryEnded(currentBlockNumber >= lotteryOverBlock);
                return currentBlockNumber >= lotteryOverBlock;

            } else {
                console.log("Lottery contract is not loaded or doesn't have an address set");
                return false;
            }
        } catch (err) {
            console.error("Error checking if lottery has ended:", err);
            return false;
        }
    }

    async function handleWinnerSelect(){
        if(lotteryEnded){
            if (lotteryContract && lotteryContract.options.address) {
                const winner = await lotteryContract.methods.winner().send({from:accounts[0]});
                console.log("Select the winner!");
                const newWinnerAddress = await lotteryContract.methods.getWinnerAddress().call();
                setWinnerAddress(newWinnerAddress);
                console.log("winner address is:");
                console.log(newWinnerAddress);
            } else {
                console.log("Lottery contract is not loaded or doesn't have an address set");
                return false;
            }
        }
    }

    async function handleCollectMoney(){
        if(lotteryEnded){
            if (lotteryContract && lotteryContract.options.address) {
                const prizeMoney = await lotteryContract.methods.collectPrize().send({from:accounts[0]});
                console.log(accounts[0]);
                await fetchWinnerAddress();
                fetchBalance();
                fetchPlayers();
            } else {
                console.log("Lottery contract is not loaded or doesn't have an address set");
                return false;
            }
        }
    }

    useEffect(()=>{
        fetchWinnerAddress();
    },lotteryEnded)

    async function fetchWinnerAddress(){
        try {
            if (lotteryContract && lotteryContract.options.address) {
                const CurrentWinnerAddress = await lotteryContract.methods.getWinnerAddress().call();
                setWinnerAddress(CurrentWinnerAddress);
            } else {
                console.log("Lottery contract is not loaded or doesn't have an address set");
            }
        } catch (err) {
            console.error("Error fetching winner address:", err);
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


    useEffect(() => {
        async function fetchData() {
            await fetchBalance();
            const ended = await hasLotteryEnded();
            setLotteryEnded(ended);
        }

        if (lotteryContract && lotteryContract.options.address) {
            fetchData();
        }
    }, [lotteryContract, fetchBalance]);

    useEffect(() => {
        async function updateLotteryEnded() {
            const ended = await hasLotteryEnded();
            setLotteryEnded(ended);
        }
        if (lotteryContract && lotteryContract.options.address) {
            updateLotteryEnded();
        }
    }, [lotteryContract, players]);

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
            from: accounts[0],
            value: web3.utils.toWei(betNumber, 'ether') // Add this line
        };
        await lotteryContract.methods.joinTheLottery().send(options);
        await fetchBalance();
        await fetchPlayers();
        await fetchWinnerAddress();
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
                            <div className="field">
                                <TextField
                                    id="outlined-lottery-contract-address"
                                    label="Lottery Contract Address"
                                    value={inputContractAddress}
                                    onChange={(e) => setInputContractAddress(e.target.value)}
                                />
                                <Button onClick={loadContract} variant={"contained"}>Load Contract</Button>
                            </div>
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
                                        <Button
                                            onClick={handleJoinLottery}
                                            variant={"contained"}
                                            disabled={lotteryEnded}
                                        >
                                            Join The Lottery
                                        </Button>
                                    </ThemeProvider>
                                </div>
                            </div>
                            <h3>The balance of this round:</h3>
                            <h2><div>
                                Current Lottery Balance: {balance} ETH
                            </div></h2>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="winner">
                            <div>
                                <h4>The winner of last round is:</h4>
                                <div className="playerlist">{winnerAddress}</div>
                                {winnerAddress && walletAddress && walletAddress.includes(winnerAddress.toLowerCase())?
                                    <div>
                                    <div className={"info-text"}>
                                        Congrats!
                                    </div>
                                    {lotteryEnded &&
                                        <div className="buttonfield">
                                            <ThemeProvider theme={theme}>
                                                <Button variant="contained" onClick={handleCollectMoney}>Collect Money</Button>
                                            </ThemeProvider>
                                        </div>}
                                    </div>:
                                <div className={"info-text"}>
                                    Try Again!
                                </div>}
                                {lotteryEnded &&
                                    <div>
                                        <ThemeProvider theme={theme}>
                                            <Button variant="contained" onClick={handleWinnerSelect}>Choose Winner</Button>
                                        </ThemeProvider>
                                    </div>}
                            </div>
                        </div>
                        <div className="players">
                            <h3>playerlist</h3>

                            <div className="playerlist">
                                {players.map((player, index) => (
                                    <div key={index}>{player}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default App;