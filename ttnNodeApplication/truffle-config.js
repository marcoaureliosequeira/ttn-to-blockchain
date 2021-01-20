module.exports = {
  networks: {
    development: {
      host: "10.204.128.208",
      port: 8000,
      network_id: "22"
      //host: "127.0.0.1",
      //port: 7545,
      //network_id: "*"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}