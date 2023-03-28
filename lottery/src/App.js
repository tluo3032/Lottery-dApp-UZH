import './styles/App.css';
import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {Button, Card, FormHelperText, Grid} from "@mui/material";
import {Container} from "@mui/material";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';


function App() {
    const [walletAddress, setWalletAddress]=useState();
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
    const [number, setNumber] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setNumber(event.target.value);
    };

    return (
      <div className="main">
          <div className="nav">
              <h1>Lottery dApp</h1>
          </div>
          <div className="row">
              <div className="column">
                  <div className="field">
                      <Card sx={{minHeight:320,padding:2}}>
                          <div className="buttonfield">
                              <Button onClick={connectWallet} variant={"contained"} >Connect Wallet</Button>
                          </div>
                          <div className={"account"}>
                              Your account address:<br/>
                              {walletAddress}
                          </div>
                          <div className="select">
                              <Box sx={{minWidth: 60}}>
                                  <FormControl sx={{minWidth: 200}}>
                                      <InputLabel id="demo-simple-select-label">Number</InputLabel>
                                      <Select
                                          labelId="demo-simple-select-helper"
                                          id="demo-simple-select"
                                          value={number}
                                          label="Number"
                                          onChange={handleChange}
                                      >
                                          <MenuItem value={1}>1</MenuItem>
                                          <MenuItem value={2}>2</MenuItem>
                                          <MenuItem value={3}>3</MenuItem>
                                          <MenuItem value={4}>4</MenuItem>
                                          <MenuItem value={5}>5</MenuItem>
                                          <MenuItem value={6}>6</MenuItem>
                                          <MenuItem value={7}>7</MenuItem>
                                          <MenuItem value={8}>8</MenuItem>
                                          <MenuItem value={9}>9</MenuItem>
                                          <MenuItem value={10}>10</MenuItem>
                                          <MenuItem value={11}>11</MenuItem>
                                          <MenuItem value={12}>12</MenuItem>
                                          <MenuItem value={13}>13</MenuItem>
                                          <MenuItem value={14}>14</MenuItem>
                                          <MenuItem value={15}>15</MenuItem>
                                          <MenuItem value={16}>16</MenuItem>
                                          <MenuItem value={17}>17</MenuItem>
                                          <MenuItem value={18}>18</MenuItem>
                                          <MenuItem value={19}>19</MenuItem>
                                          <MenuItem value={20}>20</MenuItem>
                                      </Select>
                                      <FormHelperText>Choose a number between 1 and 20</FormHelperText>
                                      <FormHelperText>Price per round:0.01 ETH</FormHelperText>
                                  </FormControl>
                              </Box>
                          </div>
                          <Button variant={"outlined"}>Play</Button>
                      </Card>
                  </div>
              </div>
              <div className="column">
                  <div className="field">
                      <Card sx={{minHeight:320,padding:2}}>
                          <div className="winner">
                              <Button variant="outlined">Get Winner</Button>
                              <h2>The winner is Sally</h2>
                          </div>
                      </Card>
                  </div>
              </div>
          </div>
      </div>
    );
}

export default App;
