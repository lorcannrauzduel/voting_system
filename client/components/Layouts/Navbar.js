import React, { Component } from 'react'
import getWeb3 from '../../lib/getWeb3'
import {
  Container,
  Button,
  Icon,
  Menu,
} from 'semantic-ui-react'
import Web3Container from '../../lib/Web3Container'

class Navbar extends Component {
    constructor(props) {
        super(props);
          this.state = {
            accounts: this.props.accounts
          }
    }
    
    connectMetamask() {
        window.ethereum.enable();
    }
    
    async componentDidMount() {
        try {
            const web3 = await getWeb3()
            const accounts = await web3.eth.getAccounts()
            this.setState({ web3, accounts })
      
        } catch (error) {
            alert(
              `La connexion à MetaMask a échoué.`
            )
            console.log(error)
        }
        
        window.ethereum.on('accountsChanged', (accounts) => {
            this.setState({accounts});
        })
    }
    render() {
        return ( 
            <div>
                <Menu fixed='top' inverted>
                  <Container>
                    <Menu.Item as='a' header>
                      <Icon color={this.state.accounts.length > 0 ? "green" : "blue"} name="circle"/>
                      {this.state.accounts[0] ? this.state.accounts[0] : <Button primary onClick={this.connectMetamask}>Se connecter à MetaMask</Button>}
                    </Menu.Item>
                  </Container>
                </Menu>
            </div>
        )
    }
 

}

export default () => (
    <Web3Container
      renderLoading={() => <Navbar accounts="" />}
      render={({ accounts }) => <Navbar accounts={accounts} />}
    />
  )
  