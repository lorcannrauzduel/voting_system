import React, { useState, useEffect }  from 'react'
import Web3Container from '../lib/Web3Container'
import { Tab, Form, Header, Comment } from 'semantic-ui-react'
import ProposalPanel from '../components/Proposal/ProposalPanel'
import HistoricalPanel from '../components/Historical/HistoricalPanel'
import Loading from '../components/Common/Loading'

const ProposalPage = (props) => {
  const [accounts, setAccounts] = useState(props.accounts);
  const contract = props.contract;
  const web3 = props.web3;

  const panes = [
    {
      menuItem: 'Propositions',
      render: () => 
      <Tab.Pane attached={false}>
        <ProposalPanel accounts={accounts} contract={contract} web3={web3}/>
      </Tab.Pane>,
    },
    {
      menuItem: 'Historique',
      render: () => 
      <Tab.Pane attached={false}>
        <HistoricalPanel accounts={accounts} contract={contract} web3={web3}/>
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
