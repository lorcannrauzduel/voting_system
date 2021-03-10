import React, { useState }  from 'react'
import { Form } from 'semantic-ui-react'
import WhitelistForm from '../Whitelist/WhitelistForm';
import { useToasts } from 'react-toast-notifications';

const ProposalForm = (props) => {
    const [proposal, setProposal] = useState();
    const { addToast } = useToasts()
    
    const addProposal = async () => {
        setProposal(proposal)
        await props.contract.methods.addProposal(proposal).send({ 
            from: props.accounts[0]
        }).on('error', function(error){ 
            addToast('Une erreur est survenue!', { appearance: 'error', autoDismiss: true });
        }).then((result) => {
            let id = result.events.ProposalRegistered.returnValues.proposalId; 
            props.contract.methods.getProposal(id).call()
            .then((proposal) => { 
                // props.onAddProposal(proposal);  
                addToast('Proposition enregistrée', { appearance: 'success', autoDismiss: true });
            });
        })
        
    }
    
    const handleProposalChange = (e) =>  {
        setProposal(e.target.value)
    }
      
    const startSession = async () => {
        await props.contract.methods.startProposalsRegistration(60).send({ 
            from: props.accounts[0] 
        }).on('error', function(error){ 
            addToast('Une erreur est survenue!', { appearance: 'error', autoDismiss: true });
        }).then(function(tx) { 
            addToast('Démarrage de la session d\'enregistrement des propositions', { appearance: 'success', autoDismiss: true });
        })
    }
      
    const closeSession = async () => {
        await props.contract.methods.closeProposalsRegistration().send({ 
            from: props.accounts[0] 
        }).on('error', function(error){ 
            addToast('Une erreur est survenue!', { appearance: 'error', autoDismiss: true });
        }).then(function(tx) { 
            addToast('Fin de la session d\'enregistrement des propositions', { appearance: 'success', autoDismiss: true });
        })
    }
    
    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Button color="green" onClick={startSession}>Démarrer la session</Form.Button>
                    <Form.Button color="red" onClick={closeSession}>Fin de la session</Form.Button>
                    <WhitelistForm contract={props.contract} accounts={props.accounts} />
                </Form.Group>
            </Form>
            
            <Form onSubmit={addProposal}>
                <Form.TextArea label='Publier une proposition' placeholder='Description...' onChange={handleProposalChange}/>
                <Form.Group>
                    <Form.Button basic color="blue">Publier</Form.Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default ProposalForm;