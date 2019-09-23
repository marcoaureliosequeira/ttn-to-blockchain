pragma solidity ^0.5.0;

contract SensorData {
    uint public dataId = 0;
    uint public dataIdError = 0;

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

    function createDataSensor (uint _temperature, uint _light, uint _battery, string memory _sensorEvent, string memory _devId, string memory _date) public {
        bool validateValues = true;

        if(dataId >= 1) {
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

        if(_battery > 0 && validateValues == true) {
            //DATA ID
            dataId ++;

            //add a instance of dataFromSensor to dataFromSensorArray
            dataFromSensorArray[dataId] = dataFromSensor(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);

            emit dataFromSensorCreated(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);
        }
        else {
            //DATA ID
            dataIdError ++;

            //add a instance of dataFromSensor to dataFromSensorArray
            dataFromSensorErrorArray[dataIdError] = dataFromSensor(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);

            emit dataFromSensorCreated(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);
        }
    }

    function getTaskCount() public returns (uint) {
        return this.dataId();
    }

}