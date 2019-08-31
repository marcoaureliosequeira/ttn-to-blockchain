App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3()
        await App.loadAccount() //LOAD SELECT META MASK'S ACCOUNT
        await App.loadContract()
        //await App.render()
    },

    //METAMASK
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        try {
            //To make sure not to overwrite the already set provider when in mist, check first if the web3 is available
            if (typeof web3 !== 'undefined') {
                App.web3Provider = web3.currentProvider;
                console.log("webProvider = ", App.web3Provider);

                web3 = await new Web3(web3.currentProvider);
                console.log("inside if");
            } else {
                // create an instance of web3 using the HTTP provider
                web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
                console.log("inside else");
            }
        }
        catch(err) {
            console.log("erro === ", err);
        }

        /**
        console.log("loadWeb3 web3 = ", web3.currentProvider);
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = await new Web3(App.web3Provider);
        } else {
            window.alert("Please connect to Metamask.")
        }
        console.log("window.ethereum = ", window.ethereum);
        // Modern dapp browsers...
        if (window.ethereum) {
            console.log("entreiiii");
            window.web3 = new Web3(ethereum)
            console.log("window.web3 = ", window.web3);
            try {
                console.log("eantes");
                // Request account access if needed
                await ethereum.enable()
                console.log("depois");
                // Acccounts now exposed
                web3.eth.sendTransaction({})
            } catch (error) {
                console.log("error = ", error);
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({})
        }
        // Non-dapp browsers...ƒ
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }**/
    },

    loadAccount: async () => {
        // Set the current blockchain account - METAMASK
        console.log("load account", web3.eth);
        App.account = web3.eth.accounts[0]
        console.log("app account", App.account);
    },

    loadContract: async () => {
        console.log("loadContract");
        // Create a JavaScript version of the smart contract
        const todoList = await $.getJSON('SensorData.json') //get build contract to json
        App.contracts.TodoList = TruffleContract(todoList) //get truffle contract; function from truffle package - node
        App.contracts.TodoList.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed()
    },

    render: async () => {
        // Prevent double render
        if (App.loading) {
            return
        }

        // Update app loading state
        App.setLoading(true)

        // Render Account
        $('#account').html(App.account)

        // Render Tasks
        await App.renderTasks()

        // Update loading state
        App.setLoading(false)
    },

    renderTasks: async () => {
        // Load the total task count from the blockchain
        const taskCount = await App.todoList.taskCount()
        const $taskTemplate = $('.taskTemplate')

        // Render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
            // Fetch the task data from the blockchain
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]

            /**
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
             **/
        }
    },

    createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.todoList.createTask(content)
        window.location.reload()
    },

    toggleCompleted: async (e) => {
        App.setLoading(true)
        const taskId = e.target.name
        await App.todoList.toggleCompleted(taskId)
        window.location.reload()
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
