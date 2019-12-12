const {
    PREFIX,
    waitForEvent
} = require('./utils')

const Web3 = require('web3')
const diesel = artifacts.require('./DieselPrice.sol')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545'))

contract('Diesel Price Tests', accounts => {

    const gasAmt = 3e6
    const address = accounts[0]

    beforeEach(async () => (
        { contract } = await diesel.deployed(),
            { methods, events } = new web3.eth.Contract(
                contract._jsonInterface,
                contract._address
            )
    ))

    it('Should revert on second query attempt due to lack of funds', async () => {
        const expErr = 'revert'
        try {
            await methods
                .update()
                .send({
                    from: address,
                    gas: gasAmt
                })
            assert.fail('Update transaction should not have succeeded!')
        } catch (e) {
            assert.isTrue(
                e.message.startsWith(`${PREFIX}${expErr}`),
                `Expected ${expErr} but got ${e.message} instead!`
            )
        }
    })
})
