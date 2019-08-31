App = {
    hostProvider: "http://localhost:7545",
    sensorDataContract: null,
    firstAccount: null,
    sensorDataAbi: require(__dirname+"/build/contracts/SensorData"),
    web3Provider: null,
    Web3 : require('web3'),
    loading: false,
    contracts: {},
    web3 : new Web3(new Web3.providers.HttpProvider(App.hostProvider)),

    load: async () => {
        await App.initweb3()
        await App.loadAccount() //LOAD SELECT META MASK'S ACCOUNT
        await App.render()
    },

    initweb3: async () => {
        try {
            //To make sure not to overwrite the already set provider when in mist, check first if the web3 is available
            if (typeof web3 !== 'undefined') {
                App.web3Provider = App.web3.currentProvider;
                console.log("webProvider = ", App.web3Provider);

                App.web3 = await new Web3(App.web3.currentProvider);
                console.log("inside if");
            } else {
                // create an instance of web3 using the HTTP provider
                App.web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
                console.log("inside else");
            }
        }
        catch(err) {
            console.log(err);
        }
    },

    loadAccount: async () => {
        console.log("start setContracts");

        App.sensorDataContract = TruffleContract(App.sensorDataAbi) //get truffle contract; function from truffle package - node
        App.sensorDataContract.setProvider(App.web3Provider)

        App.firstAccount = App.web3.eth.accounts[0];

        console.log("firstAccount = ", App.firstAccount);

        console.log("final setContracts");
    },


    render: async () => {
        // Prevent double render
        if (App.loading) {
            return
        }

        // Update app loading state
        App.setLoading(true)

        // Render Account
        //$('#account').html(App.account)

        // Render Tasks
        await App.renderTasks()

        // Update loading state
        App.setLoading(false)
    },

    renderTasks: async () => {
        console.log("---getInformationFromBlockchain---");
        console.log("\n \n");

        App.sensorDataContract.deployed().then(async function (instance) {
            let dataId = await instance.dataId();

            //console.log("dataFromSensorBC = ", dataFromSensorBC);

            // Fetch dataFromSensor on the blockchain
            for (var i = 1; i <= dataId; i++) {
                const task = await instance.dataFromSensorArray(i)
                const dataId = task[0]
                const temperatureContent = task[1]
                const humidityContent = task[2]
                const storeDate = task[3]

                console.log("----------------------------------------");
                console.log("dataId = " + dataId);
                console.log("temperatureContent = " + temperatureContent);
                console.log("humidityContent = " + humidityContent);
                console.log("storeDate = " + storeDate);
                console.log("----------------------------------------");
                console.log("\n \n");


                // Create the html for the task
                const $newTaskTemplate = $taskTemplate.clone()
                $newTaskTemplate.find('.content').html(temperatureContent)
                $newTaskTemplate.find('input')
                    .prop('name', dataId)
                    .prop('checked', temperatureContent)

                // Put the task in the correct list
                if (taskCompleted) {
                    $('#completedTaskList').append($newTaskTemplate)
                } else {
                    $('#taskList').append($newTaskTemplate)
                }

                // Show the task
                $newTaskTemplate.show()
            }
        }).then(function(result) {
            //console.log("getInformationFromBlockchain = ", result.toString());
            console.log("---final----")
        }, function (error) {
            console.log(error);
        });


        /**
        // Load the total task count from the blockchain
        const taskCount = await App.sensorData.dataId()
        const $taskTemplate = $('.taskTemplate')
        console.log("renderTasks");
        // Render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
            // Fetch the task data from the blockchain
            const task = await App.sensorData.dataFromSensorArray(i)
            const taskId = task[0]
            const taskContent = task[1]
            const taskCompleted = task[2]

            // Create the html for the task
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                .prop('name', taskId)
                .prop('checked', taskCompleted)
                .on('click', App.toggleCompleted)

            // Put the task in the correct list
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }

            // Show the task
            $newTaskTemplate.show()
            console.log("renderTasks222");

        }
         **/
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})
