var Web3 = require('web3');
const config = require('../ttnNodeApplication/config.js');
const hostProvider = config.blockchainOptions.host;

var web3 = new Web3(new Web3.providers.HttpProvider(hostProvider));
var sensorDataAbi = require("../ttnNodeApplication/build/contracts/UrlRequests");

//INITIALIZE SMART CONTRACT VARIABLE
var sensorDataContract = null;

//GET TRUFFLE CONTRACT
const TruffleContract = require('truffle-contract');

initweb3().then (function (result) { //INIT WEB3
    setContracts().then(function(result){ //WHEN INITIALIZED WEB3, SET CONTRACTS
        console.log("\n\n setContracts");

        sensorDataContract.deployed().then(function(instance){
            console.log("\n\n deployed \n\n");

            instance.getPastEvents('AllEvents', {
                //filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
                fromBlock: 0,
                toBlock: 'latest'
            }, function(error, events){ console.log(events); })
                .then(function(events){
                    console.log(events); // same results as the optional callback above
                    console.log("events final--");
                });
        });
    });
});


//SET WEB3 CONFIGURATIONS
async function initweb3() {
    try {
        //To make sure not to overwrite the already set provider when in mist, check first if the web3 is available
        if (typeof web3 !== 'undefined') {
            web3Provider = web3.currentProvider;
            console.log("webProvider = ", web3Provider);

            web3 = await new Web3(web3.currentProvider);
            console.log("inside if");
        } else {
            // create an instance of web3 using the HTTP provider
            web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
            console.log("inside else");
        }
    }
    catch(err) {
        console.log(err);
    }
}


//SET SMART CONTRACTS CONFIGURATIONS
async function setContracts () {
    console.log("start setContracts");

    //CREATE SMART CONTRACT OBJECT FROM ABI AND SET WEB3 PROVIDER
    sensorDataContract = TruffleContract(sensorDataAbi) //get truffle contract; function from truffle package - node
    sensorDataContract.setProvider(web3Provider)

    //SET NODE TO COMMUNICATE - FIRST ACCOUNT
    firstAccount = web3.eth.accounts[0];

    console.log("firstAccount = ", firstAccount);

    console.log("final setContracts");
}