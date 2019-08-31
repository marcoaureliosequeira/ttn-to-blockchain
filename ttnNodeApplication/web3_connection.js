async function initweb3() {
    try {
        /*//To make sure not to overwrite the already set provider when in mist, check first if the web3 is available
        if (typeof web3 !== 'undefined') {
                web3 = await new Web3(web3.currentProvider);
            console.log("inside if");
        } else {
            // create an instance of web3 using the HTTP provider
                web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
            console.log("inside else");
        }*/
        console.log(web3.eth.accounts[1]);
        var PublishServiceContractAddress = "0x0da136781e562e28fb1c0b3efc8ce9d8b4e226f2";
        PublishServiceContract = await new web3.eth.Contract(contract,PublishServiceContractAddress);
        //console.log(PublishServiceContract.options.jsonInterface);
        await addServiceProducer1("LC1","SP1","location:inside;reading:degree","scattr","ngac");
    }
    catch(err) {
        console.log(err);
    }
}
