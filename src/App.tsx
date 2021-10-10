import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Web3ReactProvider} from '@web3-react/core';
import {Web3Provider} from "@ethersproject/providers";
import { Welcome } from './components/Welcome';
import { Home } from './components/Home';

function getLibrary(provider: any) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000;
  return library
}

function App() {
  return (
    <Router>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Switch>
          <Route path={'/home'}>
            <Home />
          </Route><Route path={'/'}>
            <Welcome />
          </Route>
        </Switch>
      </Web3ReactProvider>
    </Router>
  );
}

export default App;
