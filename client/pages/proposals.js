import React, { useState, useEffect }  from 'react'
import Web3Container from '../lib/Web3Container'
import { Tab, Form, Header, Comment } from 'semantic-ui-react'
import moment from 'moment'
import ProposalPanel from '../components/Proposal/ProposalPanel'
import Loading from '../components/Common/Loading'

const ProposalPage = (props) => {
  const [accounts, setAccounts] = useState(props.accounts);
  const [historical, setHistorical] = useState([]);
  const contract = props.contract;
  const web3 = props.web3;

  useEffect(() => { 
    getVoted();
  }, [])
  
    
  const startSessionVote = () => {
    contract.methods.startVotingSession(60).send({ from: accounts[0] })    
    .on('confirmation', (result) => {
      console.log(result)
    }) 
    .on('error', (result) => {
      console.log(result)
    }) 
  }
  
  const closeSessionVote = () => {
    contract.methods.closeVotingSession().send({ from: accounts[0] })
    .on('confirmation', (result) => {
      console.log(result)
    }) 
    .on('error', (result) => {
      console.log(result)
    }) 
  }

  
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

  
  const listVoted = historical.map((vote, index) =>
  <Comment>
    <Comment.Content>
      <Comment.Author as='a'>{vote.voter}</Comment.Author>
      <Comment.Metadata>
        <div>{vote.timestamp}</div>
      </Comment.Metadata>
      <Comment.Text> a voté pour « {vote.proposal_title} »</Comment.Text>
    </Comment.Content>
  </Comment>
  );

  const panes = [
    {
      menuItem: 'Propositions',
      render: () => 
      <Tab.Pane attached={false}>
        <ProposalPanel accounts={accounts} contract={contract} web3={web3}/>
      </Tab.Pane>,
    },
    {
      menuItem: 'Votes',
      render: () => 
      <Tab.Pane attached={false}>
        <Form>
          <Form.Group>
            <Form.Button color="green" onClick={startSessionVote}>Démarrer la session</Form.Button>
            <Form.Button color="red" onClick={closeSessionVote}>Fin de la session</Form.Button>
          </Form.Group>
        </Form>
        <Header as='h3' dividing>
        Historique
        </Header>
        <Comment.Group>
          {listVoted}
        </Comment.Group>
      </Tab.Pane>,
    }
  ]

  return (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
  )
}

export default () => (
  <Web3Container
    renderLoading={() => <Loading/>}
    render={({ web3, accounts, contract }) => <ProposalPage accounts={accounts} contract={contract} web3={web3}  />}
  />
)
