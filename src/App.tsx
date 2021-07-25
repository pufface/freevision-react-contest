import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppConfigContextProvider } from './components/hooks/useConfig';
import CommandBar from './components/commandbar/CommandBar';
import PageHome from './pages/PageHome';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import './App.css';

const App = () => (
  <BrowserRouter>
    <AppConfigContextProvider>
      <div className="App">
        <Switch>
          <Route path="/one" component={PageOne} />
          <Route path="/two" component={PageTwo} />
          <Route component={PageHome} />
        </Switch>
        <CommandBar />
      </div>
    </AppConfigContextProvider>
  </BrowserRouter>
);

export default App;
