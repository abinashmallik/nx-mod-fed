import * as React from 'react';
import { Suspense } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import ListGroup from 'react-bootstrap/ListGroup';

const Remote1 = React.lazy(() => import('remote1/Module'));
const Remote2 = React.lazy(() => import('remote2/Module'));
const Remote3 = React.lazy(() => import('remote3/Module'));
const Remote4 = React.lazy(() => import('remote4/Module'));

import { Link, Route, Routes } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/esm/NavDropdown';

export function App() {
  const [mf, setMf] = React.useState("remote1")

  const renderMicroFrontend = React.useCallback(() => {
    switch(mf) {
      case 'remote1':
        return <Suspense fallback={<p>Loading...</p>}><Remote1 /></Suspense>;
      case 'remote2':
        return <Suspense fallback={<p>Loading...</p>}><Remote2 /></Suspense>;
      case 'remote3n4':
        return <Suspense fallback={<p>Loading...</p>}>
                  <Row>
                    <Col style={{border: '1px solid black'}}><Remote3 /></Col>
                    <Col style={{border: '1px solid black'}}><Remote4 /></Col>
                  </Row>
                </Suspense>;
      case 'remote1Standalone':
        return <Suspense fallback={<p>Loading...</p>}><Remote1 /></Suspense>;
      default:
        return <Suspense fallback={<p>Loading...</p>}><Remote1 /></Suspense>;;
    }

  },[mf]);

  return (
    <>
    <Container>
      <Row>
        <Col sm={12} style={{border: '1px solid black'}}>
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/">Nx Module Federation</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Signed in as: <a href="#login">Abinash</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        </Col>
      </Row>
      <Row>
        <Col sm={4} style={{border: '1px solid black'}}>
        <ListGroup variant="flush">
          <ListGroup.Item onClick={() => setMf("remote1")}>Remote 1</ListGroup.Item>
          <ListGroup.Item onClick={() => setMf("remote2")}>Remote 2</ListGroup.Item>
          <ListGroup.Item onClick={() => setMf("remote3n4")}>Remote 3 & 4</ListGroup.Item>
          <ListGroup.Item onClick={() => setMf("remote1Standalone")}>Remote 1 Standalone</ListGroup.Item>
        </ListGroup>
        </Col>
        <Col sm={8} style={{border: '1px solid black'}}>{renderMicroFrontend()}</Col>
      </Row>
    </Container>

    <React.Suspense fallback={<p>Loading...</p>}>
      {/* <ul>
      <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/remote1">Remote1</Link>
        </li>
        <li>
          <Link to="/remote2">Remote2</Link>
        </li>
      </ul> */}
      <Routes>
        <Route path="/remote1" element={<Remote1 />} />
        <Route path="/remote2" element={<Remote2 />} />
        <Route path="/remote3" element={<Remote3 />} />
        <Route path="/remote4" element={<Remote4 />} />
      </Routes>
    </React.Suspense>
    </>
  );
}

export default App;
