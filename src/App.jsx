import React from 'react';
import Login from './Login.jsx';
import Home from './Home.jsx';
import { BrowserRouter, Route } from 'react-router-dom';

let App = () => {
  return (
    <BrowserRouter>
      <Route exact={true} path="/" render={() => <Home />} />
      <Route exact={true} path="/login" render={() => <Login />} />
    </BrowserRouter>
  );
};

export default App;
