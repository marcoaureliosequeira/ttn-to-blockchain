var TodoList = artifacts.require("./TodoList.sol");
var SensorData = artifacts.require("./SensorData.sol");
var UrlRequests = artifacts.require("../contracts/UrlRequests.sol");

module.exports = function(deployer) {
    deployer.deploy(TodoList);
    deployer.deploy(SensorData);
    deployer.deploy(UrlRequests);
};