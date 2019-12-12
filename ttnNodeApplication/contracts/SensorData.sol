pragma solidity ^0.5.0;
import "./provableAPI_0.5.sol";

contract SensorData is usingProvable {
    uint public dataId = 0;
    uint public dataIdError = 0;
    string public responseFromApi;

    uint public dieselPriceUSD;

    struct dataFromSensor {
        uint id;
        uint temperature;
        uint light;
        uint battery;
        string sensorEvent;
        string devId;
        string date;
    }

    mapping (uint => dataFromSensor) public dataFromSensorArray; //associative array/hash, where key is a unsigned int and the array's content is a instance of Task
    mapping (uint => dataFromSensor) public dataFromSensorErrorArray; //associative array/hash, where key is a unsigned int and the array's content is a instance of Task

    //EVENT WHEN DATA SENSOR IS CREATED
    event dataFromSensorCreated(
        uint id,
        uint temperature,
        uint light,
        uint battery,
        string sensorEvent,
        string devId,
        string date
    );

    event LogNewProvableQuery(string description);
    event LogApiResponse(string response);
    event GenericLogs (string description);
    event BalanceLogs (uint description);

    function __callback(
        bytes32 myid,
        string memory result
    )
    public
    {
        require(msg.sender == provable_cbAddress());
        emit LogApiResponse(result);
        dieselPriceUSD = parseInt(result, 2); // Let's save it as cents...
        // Now do something with the USD Diesel price...
    }


    function createDataSensor (uint _temperature, uint _light, uint _battery, string memory _sensorEvent, string memory _devId, string memory _date)
    public payable {
        bool validateValues = true; //VARIABLE TO CONTROL VALIDATIONS

        if(dataId >= 1) { //VALIDATE RECORD ONLY IF ALREADY EXIST DATA SAVED
            //TEMPERATURE
            uint halfTemperatureSensorData = dataFromSensorArray[dataId].temperature/2;
            uint doubleTemperatureSensorData = dataFromSensorArray[dataId].temperature*2;

            ///LIGHT
            uint halfLightSensorData = dataFromSensorArray[dataId].light/2;
            uint doubleLightSensorData = dataFromSensorArray[dataId].light*2;

            //BATTERY
            uint halfBatterySensorData = dataFromSensorArray[dataId].battery/2;
            uint doubleBatterySensorData = dataFromSensorArray[dataId].battery*2;

            //VALIDATE IF VALUES IS BETWEEN DEFINED VALUES
            if ((_battery > halfBatterySensorData && _battery < doubleBatterySensorData) &&
                (_temperature > halfTemperatureSensorData && _temperature < doubleTemperatureSensorData) &&
                (_light > halfLightSensorData && _light < doubleLightSensorData)) {
                validateValues = true;
            }
            else {
                validateValues = false;
            }
        }

        if(_battery > 0 && validateValues == true) { //IF IS A VALID RECORD SAVE THIS ON CORRECT DATA ARRAY
            //DATA ID
            dataId ++;

            //add a instance of dataFromSensor to dataFromSensorArray
            dataFromSensorArray[dataId] = dataFromSensor(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);

            //emit dataFromSensorCreated(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);
        }
        else { //IF IS A ERROR, SAVE THIS RECORD ON ERROR'S ARRAY
            //DATA ID
            dataIdError ++;

            //add a instance of dataFromSensor to dataFromSensorArray
            dataFromSensorErrorArray[dataIdError] = dataFromSensor(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);

            //emit dataFromSensorCreated(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);
        }

        emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
        provable_query("URL", "xml(https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices.diesel");
    }

    function getTaskCount() public returns (uint) {
        return this.dataId();
    }


    function update()
    public
    payable
    {
        emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
        provable_query("URL", "xml(https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices.diesel");
    }

}