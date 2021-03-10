import React, { Component } from 'react'
import {
  Grid,
  Segment,
  Header,
  Image,
  Button
} from 'semantic-ui-react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import getWeb3 from '../lib/getWeb3'

class Home extends Component {
    constructor(props) {
        super(props);
          this.state = {
            accounts: this.props.accounts
          }
    }

    async componentDidMount() {
        try {
            const web3 = await getWeb3()
            const accounts = await web3.eth.getAccounts()
            this.setState({ web3, accounts })
        } catch (error) {
            console.log(error)
        }

        window.ethereum.on('accountsChanged', (accounts) => {
            this.setState({accounts});
        })
    }

    render() {
      return ( 
        <div>
          <Grid centered columns={2}>
            <Grid.Column>
              <Segment textAlign='center'>
                <Header as='h1'>Bienvenue sur notre système de vote décentralisé!</Header>
                <Image centered src={'./images/login.jpg'} size='large' />
                <Link href={this.state.accounts.length > 0 ? "/proposals" : "" }><Button basic content={this.state.accounts.length > 0 ? "Poursuivre" : "Vous n'êtes pas connecté"} color="red" /></Link>
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
      )
    }
}
export default () => (
  <Web3Container
    renderLoading={() => <Home accounts=""  />}
    render={({ accounts }) => <Home accounts={accounts}  />}
  />
)

