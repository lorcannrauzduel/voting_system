
import getWeb3 from '../lib/getWeb3'
import Web3 from "web3";

const checkWeb3 = () =>
  new Promise((resolve, reject) => {
     (async () => {
      try {
            const web3 = await getWeb3()
            const accounts = await web3.eth.getAccounts()
            resolve(accounts);
          } catch (error) {
            reject(error)
          }
     })()
    });
export default checkWeb3;