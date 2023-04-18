import './styles/App.css';
import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {Button, Card, FormHelperText, Grid, TextField, ThemeProvider} from "@mui/material";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import {createTheme} from "@mui/material";


function App() {
    const [walletAddress, setWalletAddress]=useState();
    const [players,setPlayers]=useState([]);
    const [betNumber,setBetNumber]=useState(0);

    const theme= createTheme({
        palette:{
            primary:{
                main:'rgba(234,173,41,0.87)',
                darker:'rgba(239,180,50,0.91)'
            },
        }
    })

    const connectWallet = async()=>{
        const provider =await detectEthereumProvider();
        if(typeof window.ethereum !== 'undefined'){
            console.log("MetaMask is installed!");
            const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
            const account=accounts[0];
            setWalletAddress(account);
            console.log(walletAddress);
        }else{
            console.log("MetaMask is not installed");
        }
    };

    const handleSetNumber=(value)=>{
        setBetNumber(value);
        console.log(betNumber);
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
                              <h6>Your account address:<br/>
                                  {walletAddress}</h6>
                          </div>}
                      </div>

                      <div className="interaction">
                          <div className="field">
                              <TextField
                                  id="outlined-number"
                                  value={betNumber}
                                  label="Ether"
                                  type="ether"
                                  InputLabelProps={{
                                      shrink: true,
                                  }}
                                  onChange={(e)=>handleSetNumber(e.target.value)}
                              />

                              <div className="buttonfield">
                                  <ThemeProvider theme={theme}>
                                    <Button onClick={connectWallet} variant={"contained"} >Join The Lottery</Button>
                                  </ThemeProvider>
                              </div>
                          </div>

                          <h3>The balance of this round:</h3>
                          <h2>16 ETH</h2>

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
