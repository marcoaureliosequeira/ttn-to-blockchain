//JQUERY IMPORT
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require('jquery')(window);

const ttn = require('ttn');
//const mysql = require('mysql');
const moment = require('moment');
const config = require('./config.js');

const appID = config.TTNOptions.appID;
const accessKey = config.TTNOptions.accessKey;

const hostProvider = config.blockchainOptions.host;

var contracts = {};

var todoListContract = null;

var Web3 = require('web3');

const TruffleContract = require('truffle-contract');
//var waterfall = require('async-waterfall');


var web3 = new Web3(new Web3.providers.HttpProvider(hostProvider));
var web3Provider = null;

var firstAccount;

/*****************/

var TodoListAbi = require(__dirname+"/build/contracts/TodoList");
var todoListAddress = null;
var todoListDeployed = null;
var todoListContractAddress;


initweb3().then (function (result) {
    setContracts().then(function(result){
        ttnClient();
    });
});


function ttnClient () {
    ttn.data(appID, accessKey)
        .then(function (client) {
            client.on("uplink", async function (devID, payload) {
                console.log("Received uplink from", devID);

                getInformationFromBlockchain();
                //setInformationInBlockchain();

            })
        })
        .catch(function (error) {
            console.error("Error", error)
            process.exit(1)
        });
}



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

async function setContracts () {
    console.log("start setContracts");

    todoListContract = TruffleContract(TodoListAbi) //get truffle contract; function from truffle package - node
    todoListContract.setProvider(web3Provider)

    firstAccount = web3.eth.accounts[0];

    console.log("firstAccount = ", firstAccount);

    console.log("final setContracts");
}

async function getInformationFromBlockchain() {
    console.log("---getInformationFromBlockchain---");

    todoListContract.deployed().then(function(instance){
        return instance.taskCount();
    }).then(function(result) {
        console.log("getInformationFromBlockchain = ", result.toString());
    }, function (error) {
        console.log(error);
    });
}


function setInformationInBlockchain () {
    console.log("init setInfo")
    todoListContract.deployed().then(function(instance){
        return instance.createDataSensor({from: firstAccount});
    }).then(function(result) {
        console.log("setInfoFinish");
    }, function (error) {
        console.log(error);ß
    });
}


function getDataFromSensorArray () {
    console.log("---getTaskArray---");

    todoListContract.deployed().then(function(instance){
        return instance.dataFromSensorArray(1);
    }).then(function(result) {
        console.log("getDataArray = ", result.toString());
    }, function (error) {
        console.log(error);
    });


}

///NOT USED
function getInfoFromDeployedSmartContract(){

    let todoListPromise;
    if (todoListAddress !== null){
        console.log("entrei no if!!");
        todoListPromise = todoListContract.at(todoListAddress);
    }else{
        console.log("entrei no else!!!!");
        todoListPromise = todoListContract.deployed();
    }

     todoListPromise.then(async todoListDep=>{
         console.log("The deployed TodoList contract is at " + todoListDep.address)

         todoListContractAddress = todoListDep.address;
         todoListDeployed = todoListContract.at(todoListDep.address);
    }).catch((error) => {
        console.error(error);
    });
}



