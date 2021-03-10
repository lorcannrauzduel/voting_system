import React from 'react'
import { Icon, Label, Comment, Button } from 'semantic-ui-react'
import { useToasts } from 'react-toast-notifications';
import getMessageError from '../../utils/getMessageError';

const ProposalItem = (props) => {
    const { addToast } = useToasts()
    
    const voteProposal = async (proposalId) => {
        await props.contract.methods.addVote(proposalId).send({ 
            from: props.accounts[0] 
        }).on('error', function(error){ 
            let message = getMessageError(error);                    
            addToast(message, { appearance: 'error', autoDismiss: true });
        }).then(function(result) { 
            addToast('Merci pour votre vote!', { appearance: 'success', autoDismiss: true });
            let id = result.events.Voted.returnValues.proposalId;
            props.onVoteProposal(id);
        })
    } 
  
    return (
        <Comment>
            <Comment.Content>
                <Comment.Author as='a'>{props.item[1]}</Comment.Author>
                <Comment.Text></Comment.Text>
                <Comment.Actions>
                    <Button as='div' labelPosition='right'>
                        <Button color='blue' onClick={() => voteProposal(props.item[0])}>
                            <Icon name='thumbs up' />
                            Voter
                        </Button>
                        <Label as='a' basic color='blue' pointing='left'>
                            {props.item[2]}
                        </Label>
                    </Button>
                </Comment.Actions>
            </Comment.Content>
        </Comment>
    )
}

export default ProposalItem;