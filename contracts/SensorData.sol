pragma solidity ^0.5.0;

contract SensorData {
    uint public dataId = 0;

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

    constructor() public {
        //createDataSensor();
    }

    function createDataSensor (uint _temperature, uint _light, uint _battery, string memory _sensorEvent, string memory _devId, string memory _date) public {
        //DATA ID
        dataId ++;

        //add a instance of dataFromSensor to dataFromSensorArray
        dataFromSensorArray[dataId] = dataFromSensor(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);

        emit dataFromSensorCreated(dataId, _temperature, _light, _battery, _sensorEvent, _devId, _date);
    }

    function getTaskCount() public returns (uint) {
        return this.dataId();
    }

}