var TodoList = artifacts.require("./TodoList.sol");
var SensorData = artifacts.require("./SensorData.sol");

module.exports = function(deployer) {
    deployer.deploy(TodoList);
    deployer.deploy(SensorData);
};