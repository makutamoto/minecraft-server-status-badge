import { AppProps } from 'next/app';
import { Container, Navbar } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function({ Component, pageProps }: AppProps) {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>
                    Minecraft Server Status Badge
                </Navbar.Brand>
            </Navbar>
            <Container className="py-4">
                <Component {...pageProps} />
            </Container>
        </>
    );
}
