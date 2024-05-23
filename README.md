# Introduction to Nx with Module Federation
### Pre-Requisite
- Basics of Nx (https://nx.dev/)
- Basics of Module Federation (https://webpack.js.org/concepts/module-federation/)
- React (https://react.dev/)

Nx is a powerful open-source build system that provides tools and techniques for enhancing developer productivity, optimizing CI performance, and maintaining code quality

### Core Features:
- Run Task Efficiently
- Distribute Tasks in CI:
- Cache Locally & Remotely:
- Split E2E Tests and Rerun Flaky Tests   
- Automate Dependency Updates 
- Nx Graph

Today we will be taking Nx to a higher level where we can use Nx to build a mono-repo microfrontend using module federation

Our aim will be to accomplish the following points

- Create a host (shell)
- Create multiple remotes 
- Load multple micro-frontends on a single page
- Load single microfrontend on a route
- Share common logic between different micro-frontend

We will be building a simple app using React which will have multple menus to fullfill our above requirements, lets gets our hands dirty and start building 

### Step-1 (creating a host)
First we need to create a nx workspace on top of which we will have our host
```
npx create-nx-workspace@latest nx-module-feration
```
We are choosing react workspace where will be creating our host and remotes

To create a host:
```
npx nx g @nx/react:host shell --directory=apps/react/shell
```

This will create our shell app under src/apps/react directory

To serve shell:
```
npx nx serve shell 
```

### Step-2 (creating remotes)

We will be creating 4 remotes here to demonstrate 4 different use case of ours

To create a remote:
```
npx nx g @nx/react:remote remote1 --directory=apps/react/remote1 --host=shell
npx nx g @nx/react:remote remote2 --directory=apps/react/remote2 --host=shell
npx nx g @nx/react:remote remote3 --directory=apps/react/remote3 --host=shell
npx nx g @nx/react:remote remote4 --directory=apps/react/remote4 --host=shell
```

Now under the root module-federation.config file we can check remotes would have added and under individual remotes Module would have been exported

Now we will be coming to our next task
Loading remotes on the shell and rendering the remote in a container in the shell

To import a remote on shell
```
const Remote1 = React.lazy(() => import('remote1/Module'));
```

Similarly we need to import all the remotes
To render a remote in a container we can directly call it as a component and here we are using bootstrap react for css framework
```
<div><Remote1 /></div>
```
I have tried to dynamically load all the components and also two components in a single container the code goes as follows:
```
<Container>
      <Row>
        <Col sm={12} style={{border: '1px solid black'}}>
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">Nx Module Federation</Navbar.Brand>
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
```

Now to render a remote on a complete new route we can use react-router and load on a differ different
Now that we have imported the remotes let take remote1 and define routes for it
```
React.Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/remote1" element={<Remote1 />} />
      </Routes>
    </React.Suspense>
```

To load on lets directly use a link tag and define its path
```
<React.Suspense fallback={<p>Loading...</p>}>
      <ul>
      <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/remote1">Remote1</Link>
        </li>
        <li>
          <Link to="/remote2">Remote2</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/remote1" element={<Remote1 />} />
        <Route path="/remote2" element={<Remote2 />} />
      </Routes>
    </React.Suspense>
```

### Step-3 (Creating a common library to share between two modules)

To create a common library
```
npx nx generate @nx/js:library --name=shared/welcome --unitTestRunner=jest --projectNameAndRootFormat=as-provided
```
Now we need to Federate the module
```
npx nx generate @nx/react:federate-module shared/welcome/src/index.ts --name=welcome --remote=remote3 --projectNameAndRootFormat=as-provided
```
Now we need to update src/app.tsx of remote3
```
import styles from './app.module.css';
import welcome from 'remote3/welcome'

export function App() {
  return (
    <div>
      <h3>Remote-3</h3>
      <div>{welcome()}</div>
    </div>
  );
}

export default App;
```
In the same way we can use the same function in remote 4
```
import styles from './app.module.css';
import welcome from 'remote3/welcome'

export function App() {
  return (
    <div>
      <h3>Remote-4</h3>
      <div>{welcome()}</div>
    </div>
  );
}

export default App;
```

Shell and remotes can be run all together or individually as per need. To run all the shell and remote:
```
npx nx serve shell --devRemotes=remote1,remote2,remote3,remote4 
```
### To check the graph
```
 nx graph
```
### To save graph into a json
```
 nx graph --file=output.json
 ```