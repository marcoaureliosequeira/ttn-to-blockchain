pragma solidity ^0.5.0;
import "./provableAPI_0.5.sol";

contract SensorData is usingProvable {
    uint public dataId = 0;
    uint public dataIdError = 0;
    string queryResult;


    uint public receivedTemperature;
    uint public receivedLight;
    uint public receivedBattery;
    string public receivedSensorEvent;
    string public receivedDevId;
    string public receivedDate;

    struct dataFromSensor {
        uint id;
        uint temperature;
        uint light;
        uint battery;
        string sensorEvent;
        string devId;
        string date;
        uint responseFromApi;
        uint responseFromApi2;
    }

    mapping (uint => dataFromSensor) public dataFromSensorArray; //associative array/hash, where key is a unsigned int and the array's content is a instance of Task
    mapping (uint => dataFromSensor) public dataFromSensorErrorArray; //associative array/hash, where key is a unsigned int and the array's content is a instance of Task

    //LOGs EVENT
    event LogNewProvableQuery(string description);

    //EVENT WHEN DATA SENSOR IS CREATED
    event dataFromSensorCreated(
        uint id,
        uint temperature,
        uint light,
        uint battery,
        string sensorEvent,
        string devId,
        string date,
        uint responseFromApi,
        uint responseFromApi2
    );

    function __callback(bytes32 myid, string memory result) public {
        if (msg.sender != provable_cbAddress()) revert();
        queryResult = result;
        //dataFromSensorArray[dataId].responseFromApi = result;

        //add a instance of dataFromSensor to dataFromSensorArray
        //dataFromSensorArray[dataId] = dataFromSensor(getTaskCount(), receivedTemperature, receivedLight, receivedBattery, receivedSensorEvent, receivedDevId, receivedDate, 243, 243);
        dataFromSensorArray[dataId] = dataFromSensor(32, 23, 43, 333, "receivedSensorEvent", "receivedDevId", "receivedDate", 243, 243);



        emit dataFromSensorCreated(32, 23, 43, 333, "receivedSensorEvent", "receivedDevId", "receivedDate", 243, 243);

        //emit LogNewProvableQuery(result);
    }

    function  createDataSensor (uint _temperature, uint _light, uint _battery, string memory _sensorEvent, string memory _devId, string memory _date)
    payable public
    {
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



            receivedTemperature = _temperature;
            receivedLight = _light;
            receivedBattery = _battery;
            receivedSensorEvent = _sensorEvent;
            receivedDevId = _devId;
            receivedDate = _date;

            if (provable_getPrice("URL") >= address(this).balance) {
                provable_query("URL", "json(https://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b6907d289e10d714a6e88b30761fae22).id");
            }

            else {
                //add a instance of dataFromSensor to dataFromSensorArray
                dataFromSensorArray[dataId] = dataFromSensor(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date, address(this).balance, uint(provable_getPrice("URL")));

                emit dataFromSensorCreated(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date, address(this).balance, uint(provable_getPrice("URL")));
            }


            //emit dataFromSensorCreated(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);
        }
        else { //IF IS A ERROR, SAVE THIS RECORD ON ERROR'S ARRAY
            //DATA ID
            dataIdError ++;

            //emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
            provable_query("URL", "json(https://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b6907d289e10d714a6e88b30761fae22).id");

            receivedTemperature = _temperature;
            receivedLight = _light;
            receivedBattery = _battery;
            receivedSensorEvent = _sensorEvent;
            receivedDevId = _devId;
            receivedDate = _date;

            //add a instance of dataFromSensor to dataFromSensorArray
            //dataFromSensorErrorArray[dataIdError] = dataFromSensor(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date, queryResult);

            //emit dataFromSensorCreated(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date, queryResult);
        }
    }

    function getTaskCount() public returns (uint) {
        return this.dataId();
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}