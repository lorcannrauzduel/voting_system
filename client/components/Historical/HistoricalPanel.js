import React, { useState, useEffect }  from 'react'
import { Tab, Form, Header, Comment } from 'semantic-ui-react'
import moment from 'moment'
import HistoricalItem from './HistoricalItem';
import { useToasts } from 'react-toast-notifications';
import getMessageError from '../../utils/getMessageError';

const HistoricalPanel = (props) => {
    const [accounts, setAccounts] = useState(props.accounts);
    const [historical, setHistorical] = useState([]);
    const contract = props.contract;
    const web3 = props.web3;
    const { addToast } = useToasts()
  
    useEffect(() => { 
      getVoted();
    }, [])
    
    
    const getVoted = () => {
      contract.getPastEvents('Voted', {
        fromBlock: 0,
        toBlock: 'latest'
      }).then(function(events){
        let listVoted = []
        let voted_historical = events;
        for (let i = 0; i < voted_historical.length; i++) {
            let proposal_id = voted_historical[i].returnValues.proposalId;
  
            contract.methods.getProposal(proposal_id).call().then(function(proposal) { 
                let proposal_title = proposal[1];
  
                web3.eth.getBlock(voted_historical[i].blockNumber).then(function(block) { 
  
                    let date = block.timestamp
                    listVoted.push({
                      hash: voted_historical[i].transactionHash,
                      voter: voted_historical[i].returnValues.voter,
                      proposal_title: proposal_title,
                      timestamp: moment(new Date(date*1000)).locale('fr').format('LL')
                    })
                });
  
            });
        }
        setTimeout(() => {
          setHistorical(listVoted);
        }, 1000)
       });
    }
      
    const startSessionVote = async () => {
      await contract.methods.startVotingSession(60).send({ from: accounts[0] })
      .on('error', function(error){ 
        let message = getMessageError(error);
        addToast(message, { appearance: 'error', autoDismiss: true });
      }).then(function(tx) { 
        addToast('Démarrage de la session de vote', { appearance: 'success', autoDismiss: true });
      })
    }
    
    const closeSessionVote = async () => {
      await contract.methods.closeVotingSession().send({ from: accounts[0] })
      .on('error', function(error){ 
        let message = getMessageError(error);
        addToast(message, { appearance: 'error', autoDismiss: true });
      }).then(function(tx) { 
        addToast('Fin de la session de vote', { appearance: 'success', autoDismiss: true });
      })
    }
    
    const getWinningProposal = async () => {
        await contract.methods.getWinningInfo().call(function(err, proposal) { 
          if(err == null) {
            addToast('Proposition gagnante : « '+proposal.description+' » avec '+proposal.voteCount+' votes', { appearance: 'success' });
          } else {
            addToast('Une erreur est survenue', { appearance: 'error', autoDismiss: true });
          }
        })
    }
  
    const countAllVote = async () => {
        await contract.methods.getWinningProposal().send({ from: accounts[0] })
        .on('error', function(error){ 
          let message = getMessageError(error);
          addToast(message, { appearance: 'error', autoDismiss: true });
        }).then(function(tx) { 
          addToast('Les votes ont été comptabilisés', { appearance: 'success', autoDismiss: true });
        })
    }
    
    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Button color="green" onClick={startSessionVote}>Démarrer la session</Form.Button>
                    <Form.Button color="red" onClick={closeSessionVote}>Fin de la session</Form.Button>
                    <Form.Button color="blue" onClick={getWinningProposal}>Connaître la proposition gagnante</Form.Button>
                    <Form.Button basic color="blue" onClick={countAllVote}>Comptabiliser les votes</Form.Button>
                </Form.Group>
            </Form>
            <Header as='h3' dividing>
                Historique
            </Header>
            <Comment.Group>
                {historical.map((vote, index) =>
                    <HistoricalItem key={index} item={vote}/>
                )}
            </Comment.Group>
        </div>
    )
}

export default HistoricalPanel;