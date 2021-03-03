const config = require('./config');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.rpc_server));

module.exports = web3;