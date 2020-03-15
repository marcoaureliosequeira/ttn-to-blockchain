var fs = require('fs');

//JQUERY IMPORT
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require('jquery')(window);

const ttn = require('ttn');
const moment = require('moment');
const config = require('./config.js');

//TTN CONFIGURATIONS
const appID = config.TTNOptions.appID;
const accessKey = config.TTNOptions.accessKey;

//BLOCKCHAIN CONFIGURATIONS
const hostProvider = config.blockchainOptions.host;

//INITIALIZE SMART CONTRACT VARIABLE
var sensorDataContract = null;

//GET WEB3.js
var Web3 = require('web3');

//GET TRUFFLE CONTRACT
const TruffleContract = require('truffle-contract');

//CREATE WEB3 OBJECT TO BLOCKCHAIN
var web3 = new Web3(new Web3.providers.HttpProvider(hostProvider));
var web3Provider = null;

var firstAccount;

/*****************/
//SMART CONTRACT'S ABI - Application Binary Interface, is basically how you call functions in a contract and get data back
var sensorDataAbi = require(__dirname+"/build/contracts/SensorData");

//**************************
//******MAIN EXECUTION******
//**************************

initweb3().then (function (result) { //INIT WEB3
    setContracts().then(function(result){ //WHEN INITIALIZED WEB3, SET CONTRACTS
        datasetToBlockchain().then(function(){
            return;
        }); //WHEN ALL DATA IS PREPARED, LISTENING DATA FROM TTN SENSOR
    });
});

//**************************
//******AUX FUNCTIONS*******
//**************************


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

//SEND DATA TO BLOCKCHAIN
function setInformationInBlockchain (temperature, humidity, location, light, battery, sensorEvent, devId, dataDate) {
    return sensorDataContract.deployed().then(function(instance){ //WHEN SMART CONTRACT IS DEPLOYED, CALL SMART CONTRACT'S METHOD
        return instance.createDataSensor(temperature, humidity, location, light, battery, sensorEvent, devId, dataDate, "", {from: firstAccount});
    }).then(function(result) {
        console.log("setInformationInBlockchain");
        return 1;
    }, function (error) {
        console.log(error);
    });
}

//GET DATA FROM CSV AND STORE IN BLOCKCHAIN
async function datasetToBlockchain () {
    let locationName = 'Zavattari';
    console.log("[datasetToBlockchain] entrei")
    let fileText = fs.readFileSync('../Datasets/Milan/'+locationName+'/'+locationName+'data_compiled.csv').toString();
    let dataFromCsv = CSVToArray(fileText, ";");

    let devicesArray = {
        'Brera': '0',
        'FilippoJuvara': '1',
        'Lambrate': '2',
        'Marche': '3',
        'Zavattari': '4',
    }

    //for (let i = 0; i < 2; i++) {
    for (let i = 0; i < dataFromCsv.length; i++) {
        let temperatureAux = dataFromCsv[i][2] * 1000;
        let humidityAux = dataFromCsv[i][3] * 1000;

        let location = dataFromCsv[i][0];
        let dateTime = dataFromCsv[i][1];
        let temperature = temperatureAux.toString();
        let humidity = humidityAux.toString();
        let light = 100;
        let battery = 100;
        let devId = devicesArray[locationName];
        let sensorEvent = "dataset";

        console.log(i)
        console.log(temperature, humidity, location, light, battery, sensorEvent, devId, dateTime)

        await setInformationInBlockchain(temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
    }
}



// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
        ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }


        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );

        } else {

            // We found a non-quoted value.
            var strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
console.log("arrData = ", arrData[0]);
    // Return the parsed data.
    return( arrData );
}