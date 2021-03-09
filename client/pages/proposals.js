import React, { useState, useEffect }  from 'react'
import Link from 'next/link'
import getWeb3 from '../lib/getWeb3'
import checkAccounts from '../lib/checkAccounts'
import Web3Container from '../lib/Web3Container'
import { Tab, Form } from 'semantic-ui-react'

const ProposalPage = (props) => {
  const [proposal, setProposal] = useState();
  const [accounts, setAccounts] = useState(props.accounts);

  const addProposal = () => {
    setProposal(proposal)
  }

  const handleChange = (e) =>  {
    setProposal(e.target.value)
  }

  const panes = [
    {
      menuItem: 'Propositions',
      render: () => 
      <Tab.Pane attached={false}>
        <Form onSubmit={addProposal}>
          <Form.TextArea label='Publier une proposition' placeholder='Description...' onChange={handleChange}/>
          <Form.Button>Publier</Form.Button>
        </Form>
      </Tab.Pane>,
    },
    {
      menuItem: 'Historique',
      render: () => <Tab.Pane attached={false}>Historique</Tab.Pane>,
    }
  ]

  return (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
  )
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Chargement...</div>}
    render={({ accounts }) => <ProposalPage accounts={accounts} />}
  />
)
