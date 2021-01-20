var fs = require('fs');
var os 	= require('os-utils');
var usage = require('cpu-percentage');

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

const {performance} = require('perf_hooks');

/*****************/
//SMART CONTRACT'S ABI - Application Binary Interface, is basically how you call functions in a contract and get data back
var sensorDataAbi = require(__dirname+"/build/contracts/SensorData");

//**************************
//******MAIN EXECUTION******
//**************************

initweb3().then (function (result) { //INIT WEB3
    setContracts().then(function(result){ //WHEN INITIALIZED WEB3, SET CONTRACTS
        setInterval(() => {
            setInformationInBlockchain("324", 2, 2, "2", 2, 2, "2", "2", "23")
                .then((data) => { console.log("done"); });
        }, 500);
    });
});

//**************************
//******AUX FUNCTIONS*******
//**************************


//SET WEB3 CONFIGURATIONS
async function initweb3() {
    try {
        //To make sure not to overwrite the already set provider when in mist, check first if the web3 is available
        // if (typeof web3 !== 'undefined') {
        //     web3Provider = web3.currentProvider;
        //     console.log("webProvider = ", web3Provider);
        //
        //     web3 = await new Web3(web3.currentProvider);
        //     console.log("inside if");
        // } else {
        // create an instance of web3 using the HTTP provider
        web3 = await new Web3(new Web3.providers.HttpProvider("http://10.204.128.208:8000"));
        web3Provider = web3.currentProvider;
        console.log("inside else");
        console.log("web3 = ", web3)
        // }
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

    web3.personal.unlockAccount(firstAccount,"123456", 15000)

    console.log("firstAccount = ", firstAccount);

    console.log("final setContracts");
}

//SEND DATA TO BLOCKCHAIN
function setInformationInBlockchain (time, temperature, humidity, location, light, battery, sensorEvent, devId, dataDate) {
    console.log("setInformationInBlockchain init");
    return sensorDataContract.deployed().then(function(instance){ //WHEN SMART CONTRACT IS DEPLOYED, CALL SMART CONTRACT'S METHOD
        return instance.createDataSensor(temperature, humidity, location, light, battery, sensorEvent, devId, dataDate, "", {from: firstAccount});
    }).then(function(result) {
        console.log("setInformationInBlockchain");
        const t1 = performance.now();

        let totalTime = t1 - time;

        let stringToFile = '';

        stringToFile += totalTime + ";\n";


        fs.appendFile('LOGS\\LogTime.txt', stringToFile, function (err) {
            if (err) return console.log(err);
            console.log('insertTime.txt');
        });

        console.log(`Call to insert in Blockchain took ${t1 - time} milliseconds.`);
        return 1;
    }, function (error) {
        const t1 = performance.now();
        console.log(`Call to insert in Blockchain took ${t1 - time} milliseconds.`);
        console.log(error);
    });
}

//GET DATA FROM CSV AND STORE IN BLOCKCHAIN
async function datasetToBlockchain () {

    //FAKE DATA VARIABLE CONTROLLER
    let fakeData = false;

    //RANDOM FAKE DATA
    let fakeRandomData = false;

    //SUBTRACT 10% TO METEO DATA
    let percentageTemperatureDown = 0.4;
    let fakeDownSlowTemperatureData = false;
    let percentageHumidityDown = 0.1;
    let fakeDownSlowHumidityData = false;

    //ADD 10% TO METEO DATA
    let percentageTemperatureUp = 0.9;
    let fakeUpSlowTemperatureData = false;
    let percentageHumidityUp = 0.1;
    let fakeUpSlowHumidityData = false;


    //SIMULATE ERROR AT SENSOR
    let simulateSensorError = true;

    //ITERATION TO START SIMULATION OF SENSOR ERROR
    let iterationErrorToStart = 36; //IF DOWN AND UP SENSOR OPTIONS, PUT VARIABLE TO 10000000





    let minTemperatureValue = false;
    //let minTemperatureValue = -30 * 1000;


    let minHumidityValue = false;
    //let minHumidityValue = 0.8*1000;


    let maxTemperatureValue = false;
    //let maxTemperatureValue = 50*1000;


    let maxHumidityValue = false;
    //let maxHumidityValue = 103*1000;


    let scaleTemperatureValue = false;
    //let scaleTemperatureValue = 1.5;


    let scaleHumidityValue = false;
    //let scaleHumidityValue = 1.01;


    let offsetTemperatureValue = false;
    //let offsetTemperatureValue = 5 * 1000;


    let offsetHumidityValue = false;
    //let offsetHumidityValue = 1 * 1000;


    let insertedRandomValue = false;


    let iterationsWithoutFailures = 105;

    let permanentlyFakeData = true;



    let locationName = 'Brera';
    //let locationName = 'falhas';

    console.log("[datasetToBlockchain] entrei")
    let fileText = fs.readFileSync('../Datasets/Milan/'+locationName+'/'+locationName+'data_compiled.csv').toString();
    //let fileText = fs.readFileSync('C:\\Users\\marco\\PersonalProjects\\ttn-to-blockchain\\Datasets\\falhas\\falhas_data_compiled.csv').toString();
    //let fileText = fs.readFileSync('../Datasets/Falhas'+'/'+locationName+'_data_compiled.csv').toString();
    let dataFromCsv = CSVToArray(fileText, ";");

    let devicesArray = {
        'Brera': '0',
        'FilippoJuvara': '1',
        'Lambrate': '2',
        'Marche': '3',
        'Zavattari': '4',
        'falhas' : '5'
    }

    for (let i = 0; i < 10; i++) {
        //for (let i = 0; i < dataFromCsv.length; i++) {
        const t0 = performance.now();

        console.log("---INDEX---")
        console.log("-- " + i + " -- \n")

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



        if(fakeData === true) {
            console.log("fakeData = true");
            console.log("fakeData2 = ", minTemperatureValue, minHumidityValue, maxTemperatureValue, maxHumidityValue, scaleTemperatureValue, scaleHumidityValue, offsetTemperatureValue, offsetHumidityValue);
            if(minTemperatureValue === false && minHumidityValue === false && maxTemperatureValue === false && maxHumidityValue === false
                && scaleTemperatureValue === false && scaleHumidityValue === false && offsetTemperatureValue === false && offsetHumidityValue === false) {

                console.log("fake3 = ", simulateSensorError, i, iterationErrorToStart, !simulateSensorError || (simulateSensorError && i <= iterationErrorToStart));

                //IF SIMULATE SENSOR ERROR NOT INSERT CORRECT RECORD
                if(!simulateSensorError || (simulateSensorError && i <= iterationErrorToStart)) {
                    console.log("normal insert")
                    await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                }

                let insertDataToBlockchain = false;

                if(!simulateSensorError && i > 1 && i % 5 === 0) {
                    console.log("\n\n rest zero! \n\n")
                    if(fakeRandomData === true) {
                        var pos = 50,
                            neg = 30,
                            result;

                        result = Math.floor(Math.random() * (pos + neg)) - neg;
                        temperature = result < 0 ? result : result + 1;

                        temperature = temperature * 1000;

                        //temperature = Math.floor(Math.random() * 100) * 1000;
                        humidity = Math.floor(Math.random() * 103) * 1000;
                    }

                    if(fakeDownSlowTemperatureData === true) {
                        temperatureAux = temperatureAux * (1 - percentageTemperatureDown);
                    }

                    if(fakeDownSlowHumidityData === true) {
                        humidityAux = humidityAux * (1 - percentageHumidityDown);
                    }

                    if(fakeUpSlowTemperatureData === true) {
                        temperatureAux = temperatureAux * (1 + percentageTemperatureUp);
                    }

                    if(fakeUpSlowHumidityData === true) {
                        humidityAux = humidityAux * (1 + percentageHumidityUp);
                    }

                    insertDataToBlockchain = true;
                }
                else if (i >= iterationErrorToStart) {
                    console.log("change permanent")
                    temperatureAux = temperatureAux * 1.1;
                    humidityAux = humidityAux * 1.1;

                    insertDataToBlockchain = true;
                }


                if(insertDataToBlockchain === true) {
                    temperature = parseInt(temperatureAux).toString();
                    humidity = parseInt(humidityAux).toString();

                    sensorEvent = 'Fake';

                    //INSERT FAKE DATA
                    console.log("\n\nFAKE")
                    console.log(temperature, humidity, location, light, battery, sensorEvent, devId, dateTime)
                    await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                }
            } else {

                console.log("normal insert")
                await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);

                if(permanentlyFakeData === true)
                    insertedRandomValue = false;

                if(insertedRandomValue === false && i >= iterationsWithoutFailures) {
                    let randomInsert = Math.random() >= 0.5;

                    //PERMANENTLY INSERT ALWAYS FAKE
                    if(randomInsert === true || permanentlyFakeData === true) {
                        insertedRandomValue = true;
                        sensorEvent = "fake"

                        console.log("\n\nFAKE\n");
                        console.log("iteration = ", i);

                        if(minTemperatureValue !== false) {
                            temperature = minTemperatureValue;

                            console.log("Min Temperature fake insert = ", temperature)

                            await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                        }
                        if(minHumidityValue !== false) {
                            humidity = minHumidityValue;

                            console.log("Min Humidity fake insert = ", humidity)

                            await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                        }
                        if(maxTemperatureValue !== false) {
                            temperature = maxTemperatureValue;

                            console.log("Max Temperature fake insert = ", temperature)

                            await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                        }
                        if(maxHumidityValue !== false) {
                            humidity = maxHumidityValue;

                            console.log("Max Humidity fake insert = ", humidity)

                            await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                        }
                        if(scaleTemperatureValue !== false) {
                            temperature = temperature/1000;

                            temperature = temperature * scaleTemperatureValue * 1000;

                            console.log("Scale Temperature fake insert = ", temperature)

                            await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                        }
                        if(scaleHumidityValue !== false) {
                            humidity = humidity/1000;

                            humidity = humidity * scaleHumidityValue * 1000;

                            humidity = parseInt(humidity);

                            console.log("Scale Humidity fake insert = ", humidity)

                            await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                        }
                        if(offsetTemperatureValue !== false) {
                            temperature = parseInt(temperature) + parseInt(offsetTemperatureValue);

                            console.log("Offset Temperature fake insert = ", temperature)

                            await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                        }
                        if(offsetHumidityValue !== false) {
                            humidity = parseInt(humidity) + parseInt(offsetHumidityValue);

                            console.log("Offset Humidity fake insert = ", humidity)

                            await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
                        }
                    }
                }
            }
        } else {
            console.log("NORMAL INSERT")
            console.log(temperature, humidity, location, light, battery, sensorEvent, devId, dateTime)
            await setInformationInBlockchain(t0, temperature, humidity, location, light, battery, sensorEvent, devId, dateTime);
        }
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