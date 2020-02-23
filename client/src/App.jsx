//Librairies
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//Compononents
import Messenger from './Components/Messenger/Messenger.jsx';
import ActiveUsers from './Components/Active/ActiveUsers.jsx';
import Home from './Components/Home/Home.jsx';
import Login from './Components/Home/Login.jsx';
import LeftNav from './Components/Navbar/LeftNav.jsx';
import TopNav from './Components/Navbar/TopNav.jsx';

let Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 2em 1fr;
  grid-template-areas: 'nav nav' 'side main';
  height: 100vh;
`;

let App = () => {
  let renderHome = () => {
    return <Home />;
  };
  let renderMessenger = renderData => {
    console.log('render messenger');
    return <Messenger convoID={renderData.match.params.mid} />;
  };
  let renderActiveUsers = () => {
    return <ActiveUsers />;
  };
  let renderLogin = () => {
    return <Login />;
  };

  console.log('App.jsx');
  return (
    <BrowserRouter>
      <Container>
        <LeftNav />
        <TopNav />
        <Route exact={true} path="/" render={renderHome} />
        <Route
          exact={true}
          path="/messenger/:mid"
          render={renderData => renderMessenger(renderData)}
        />
        <Route exact={true} path="/active-users" render={renderActiveUsers} />
        <Route exact={true} path="/login" render={renderLogin} />
      </Container>
    </BrowserRouter>
  );
};

export default App;
