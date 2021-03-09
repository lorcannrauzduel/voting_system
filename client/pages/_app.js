import {
    Container
  } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Navbar from '../components/Navbar'

const MyApp = ({ Component, pageProps }) => (
    <div>
        <Navbar/>
        <Container style={{ marginTop: '7em' }}>
            <Component propOne="ok" {...pageProps} />
        </Container>
    </div>
)

export default MyApp