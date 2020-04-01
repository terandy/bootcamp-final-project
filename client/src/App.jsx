//Librairies
import React, { useEffect, useRef } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from './Components/Home/Login.jsx';
//Compononents
import Messenger from './Components/Messenger/Messenger.jsx';
import VideoChatPeer from './Components/Video/VideoChatPeer.jsx';
import Profile from './Components/Profile/Profile.jsx';
import OtherProfile from './Components/Profile/OtherProfile.jsx';
import ActiveUsers from './Components/Active/ActiveUsers.jsx';
import Home from './Components/Home/Home.jsx';
import Login from './Components/Home/Login.jsx';
import Register from './Components/Home/Register.jsx';
import SideNav from './Components/Navbar/SideNav.jsx';
import TopNav from './Components/Navbar/TopNav.jsx';
import { SIDE_BAR_WIDTH, TOP_BAR_HEIGHT, BG_COLOR } from './data.js';

let Container = styled.div`
  & > div {
    display: flex;
  }
`;
let MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
`;
let Main = styled.div`
  box-sizing: border-box;
  padding-top: ${TOP_BAR_HEIGHT}px;
  padding-left: ${SIDE_BAR_WIDTH}px;
  width: 100%;
  height: 100%;
`;
let App = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  let login = useSelector(state => state.login);
  let conversations = useSelector(state => state.conversations);
  let convosRef = useRef();
  convosRef.current = conversations;

  let getMessageFunction = (
    convoID,
    sender,
    content,
    time,
    users,
    arrayOfUsersInfo
  ) => {
    if (!convosRef.current[convoID]) {
      console.log('no convosRef.current');
      let newConvo = {
        convoID: convoID,
        messages: [],
        members: users
      };
      dispatch({
        type: 'new-convo',
        content: {
          convoID: convoID,
          convo: newConvo,
          arrayOfMemberInfo: arrayOfUsersInfo
        }
      });
    }
    dispatch({
      type: 'get-message',
      content: { sender, content, time, convoID }
    });
  };
  //Listening for events
  useEffect(() => {
    socket.on('active login', userInfo => {
      dispatch({ type: 'active-login', content: userInfo });
    });
    socket.on('active logout', userID => {
      dispatch({ type: 'active-logout', content: userID });
    });
    socket.on('send convo', (convoID, convo, arrayOfMemberInfo) => {
      console.log('send convo');
      dispatch({
        type: 'new-convo',
        content: { convoID, convo, arrayOfMemberInfo }
      });
    });
    socket.on(
      'get message',
      (convoID, sender, content, time, users, arrayOfUsersInfo) => {
        console.log('get message in app.jsx');
        getMessageFunction(
          convoID,
          sender,
          content,
          time,
          users,
          arrayOfUsersInfo
        );
      }
    );
    socket.on('new convo', (convoID, convo, arrayOfMemberInfo) => {
      console.log('new convo in App.jsx');
      dispatch({
        type: 'new-convo',
        content: { convoID, convo, arrayOfMemberInfo }
      });
    });
    socket.on('StartVideoChat', (convoID, user) => {
      if (
        window.confirm(
          user + ' wants to start video chat! Click OK to join conversation.'
        )
      ) {
        history.push('/video-chat/' + convoID);
      }
    });
  }, []);

  let renderHome = () => {
    return <Home />;
  };
  let renderMessenger = renderData => {
    return <Messenger convoID={renderData.match.params.mid} />;
  };
  let renderVideoChat = renderData => {
    return <VideoChatPeer convoID={renderData.match.params.mid} />;
  };
  let renderMainMessenger = () => {
    return <Messenger />;
  };
  let renderProfile = () => {
    return <Profile />;
  };
  let renderViewProfile = renderData => {
    return <OtherProfile userID={renderData.match.params.userID} />;
  };
  let renderActiveUsers = () => {
    return <ActiveUsers />;
  };
  let renderLogin = () => {
    return <Login />;
  };
  let renderRegister = () => {
    return <Register />;
  };
  let checkCookies = async () => {
    console.log('checkCookies in App.jsx');
    let responseBody = await fetch('/check-cookies', { method: 'POST' });
    let responseText = await responseBody.text();
    let response = JSON.parse(responseText);
    if (response.success) {
      socket.connect();
      socket.emit('reload', response.userInfo);
      dispatch({
        type: 'login',
        content: {
          userInfo: response.userInfo,
          activeUsers: response.activeUsers,
          convoList: response.convoList,
          convoUsers: response.convoUsers
        }
      });
    }
  };
  useEffect(() => {
    if (!login) {
      checkCookies();
    }
  }, []);
  return (
    <Container loggedIn={login}>
      <TopNav />
      <MainContainer>
        <SideNav />
        <Main>
          <Route exact={true} path="/" render={renderHome} />
          <Route
            exact={true}
            path="/video-chat/:mid"
            render={renderData => renderVideoChat(renderData)}
          />
          <Route
            exact={true}
            path="/messenger/:mid"
            render={renderData => renderMessenger(renderData)}
          />
          <Route
            exact={true}
            path="/messenger"
            render={() => renderMainMessenger()}
          />
          <Route exact={true} path="/profile" render={() => renderProfile()} />
          <Route
            exact={true}
            path="/view-profile/:userID"
            render={renderData => renderViewProfile(renderData)}
          />
          <Route exact={true} path="/active-users" render={renderActiveUsers} />
          <Route exact={true} path="/login" render={renderLogin} />
          <Route exact={true} path="/register" render={renderRegister} />
        </Main>
      </MainContainer>
    </Container>
  );
};

export default App;
