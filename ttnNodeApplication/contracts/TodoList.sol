pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;

    struct dataFromSensor {
        uint id;
    }

    mapping (uint => dataFromSensor) public dataFromSensorArray; //associative array/hash, where key is a unsigned int and the array's content is a instance of Task

    event dataFromSensorCreated(
        uint id
    );

    //populate tasks when the contract is contructed
    constructor() public {
        createDataSensor();
    }

    function createDataSensor () public {
        //task's id
        taskCount ++;

        //add a instance of task to task's array
        dataFromSensorArray[taskCount] = dataFromSensor(taskCount);

        emit dataFromSensorCreated(taskCount);
    }

    function getTaskCount() public returns (uint) {
        return this.taskCount();
    }

}