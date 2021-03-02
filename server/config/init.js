const config = require('./contract');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.rpc_server));
const contractInstance = new web3.eth.Contract(config.abi, config.contract_address);

// Check connexion
web3.eth.net.isListening()
.then(() => console.log('Connexion au contrat : OK'))
.catch(e => console.log('Connexion au contrat : '+ e));

module.exports = contractInstance;
