import React from 'react';
import { Router } from 'react-router-dom';
import history from './history';

import Routes from './routes';
import './App.scss';

function App() {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
}

export default App;
