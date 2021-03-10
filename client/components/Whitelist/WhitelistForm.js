
import React, { useState }  from 'react'
import { Header, Button, Icon, Modal, Form } from 'semantic-ui-react'
import { useToasts } from 'react-toast-notifications';

const WhitelistForm = (props) => {
    const [address, setAddresses] = useState();
    const [open, setOpen] = React.useState(false);
    const { addToast } = useToasts();
    
    const submitWhitelist = () => {
        setOpen(false);
        props.contract.methods.addWhiteList(address).send({ 
            from: props.accounts[0] 
        }).on('error', function(error){ 
            addToast('Une erreur est survenue!', { appearance: 'error', autoDismiss: true });
        }).then(function(tx) { 
            addToast('Ajouté à la liste blanche', { appearance: 'success', autoDismiss: true });
        })
    }
    
    const handleAdressChange = (e) => {
        setAddresses(e.target.value)
    }
    
    return (
        <Modal
            closeIcon
            open={open}
            trigger={<Form.Button>Ajouter à liste blanche</Form.Button>}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            >
            <Header content='Ajouter à liste blanche' />
            <Modal.Content>
                <Form>
                    <Form.Input label='Addresse Ethereum' placeholder='0x123...' onChange={handleAdressChange}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
            <Button color='red' onClick={() => setOpen(false)}>
                <Icon name='remove' /> Annuler
            </Button>
            <Button color='green'  onClick={submitWhitelist}>
                <Icon name='checkmark' /> Ajouter
            </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default WhitelistForm;