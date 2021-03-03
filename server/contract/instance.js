const config = require('./config');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.rpc_server));
const contractInstance = new web3.eth.Contract(config.abi, config.contract_address);

// console.log(contractInstance);
// Check connexion
web3.eth.net.isListening()
.then(() => console.log('Connexion au contrat : OK'))
.catch(e => console.log('Connexion au contrat : '+ e));

module.exports = {
    config,
    web3,
    contractInstance
};