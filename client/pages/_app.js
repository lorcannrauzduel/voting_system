import {
    Container
  } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Navbar from '../components/Layouts/Navbar'
import "@babel/polyfill";
import { ToastProvider } from 'react-toast-notifications';

const MyApp = ({ Component, pageProps }) => {              
    return (
        <div>
        <ToastProvider>
            <Navbar/>
            <Container style={{ marginTop: '7em' }}>
                <Component {...pageProps} />
            </Container>
        </ToastProvider>
        </div>
    )
}

export default MyApp;