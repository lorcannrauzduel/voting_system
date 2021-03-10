import React, { useState, useEffect }  from 'react'
import { Header, Comment } from 'semantic-ui-react'
import ProposalItem from './ProposalItem';
import ProposalForm from './ProposalForm';
import { useToasts } from 'react-toast-notifications';

const ProposalPanel = (props) => {
    const [accounts, setAccounts] = useState(props.accounts);
    const [proposals, setProposals] = useState([]);
    const contract = props.contract;
    const { addToast } = useToasts();
    
    useEffect(() => { 
        getProposals();
        
        contract.events.Voted()
        .on('data', async (event) => {
            let proposal_id = event.returnValues.proposalId;
            let voter = event.returnValues.voter;
            contract.methods.getProposal(proposal_id).call()
            .then((proposal) => { 
             //handleVote(proposal_id)
              addToast('Nouveau vote : '+voter + ' a voté pour : ' + proposal[1], { appearance: 'success', autoDismiss: true });
          });
        })
        
        contract.events.ProposalRegistered()
        .on('data', async (event) => {
            let proposal_id = event.returnValues.proposalId;
            contract.methods.getProposal(proposal_id).call()
            .then((proposal) => { 
              handleProposal(proposal);
              addToast('Nouvelle proposition : '+proposal[1]+' ', { appearance: 'success', autoDismiss: true });
          });
        })
    }, [])
      
    const getProposals = async() => {
        await contract.methods.getProposalCount().call().then(function(count) { 
          let array = [];
          let proposalCount = count;
              for (let i = 0; i < proposalCount; i++) {
                  contract.methods.getProposal(i).call().then(function(proposal) { 
                    array.push(proposal)
                  });
              }
              setTimeout(() => {
                setProposals(array);
              }, 250)
        })  
    }
    
    const handleProposal = (proposal) => {
        setProposals(proposals => [...proposals, proposal]);
    }
    
    const handleVote = (id) => {
      const newList = proposals.map((item) => {
        if (item[0] === id) {
          const updatedItem = {
            0: item[0],
            1: item[1],
            2: (parseInt(item[2]) + 1)
          }
   
          return updatedItem;
        }
   
        return item;
      });
      setProposals(newList);
    }
    
    return (
        <div>
        <ProposalForm contract={contract} accounts={accounts} onAddProposal={handleProposal} />
        <Comment.Group>
        <Header as='h3' dividing>
          Liste des propositions
        </Header>
          {proposals.map((proposal, index) =>
            <ProposalItem key={index} item={proposal} contract={contract} accounts={accounts} onVoteProposal={handleVote}/>
          )}
        </Comment.Group>
        </div>
    )
}

export default ProposalPanel;
  