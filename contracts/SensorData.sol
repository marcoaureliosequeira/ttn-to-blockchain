pragma solidity ^0.5.0;

contract SensorData {
    uint public dataId = 0;

    struct dataFromSensor {
        uint id;
        uint temperature;
        uint humidity;
    }

    mapping (uint => dataFromSensor) public dataFromSensorArray; //associative array/hash, where key is a unsigned int and the array's content is a instance of Task

    //EVENT WHEN DATA SENSOR IS CREATED
    event dataFromSensorCreated(
        uint id,
        uint temperature,
        uint humidity
    );

    constructor() public {
        //createDataSensor();
    }

    function createDataSensor () public {
        //DATA ID
        dataId ++;

        //add a instance of task to task's array
        dataFromSensorArray[dataId] = dataFromSensor(dataId);

        emit dataFromSensorCreated(dataId);
    }

    function getTaskCount() public returns (uint) {
        return this.dataId();
    }

}