//Librairies
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from './Components/Home/Login.jsx';
import { pc } from './Components/Video/VideoChat.jsx';
import { sessionDescription } from './Components/Messenger/MsgInput.jsx';
//Compononents
import Messenger from './Components/Messenger/Messenger.jsx';
import VideoChat from './Components/Video/VideoChat.jsx';
import Profile from './Components/Profile/Profile.jsx';
import ActiveUsers from './Components/Active/ActiveUsers.jsx';
import Home from './Components/Home/Home.jsx';
import Login from './Components/Home/Login.jsx';
import Register from './Components/Home/Register.jsx';
import SideNav from './Components/Navbar/SideNav.jsx';
import TopNav from './Components/Navbar/TopNav.jsx';
import { SIDE_BAR_WIDTH, TOP_BAR_HEIGHT, BG_COLOR } from './data.js';

let Container = styled.div`
  display: grid;
  grid-template-areas: ${props =>
    props.loggedIn
      ? "'topNav topNav' 'sideNav main'"
      : "'topNav topNav''main main'"};

  grid-template-rows: ${TOP_BAR_HEIGHT}vh 1fr;
  grid-template-columns: ${SIDE_BAR_WIDTH}px 1fr;
  height: 100vh;
`;
let Main = styled.div`
  display: grid;
  grid-area: main;
  background-color: ${BG_COLOR};
`;

let App = () => {
  const dispatch = useDispatch();
  let login = useSelector(state => state.login);
  let conversations = useSelector(state => state.conversations);
  let convosRef = useRef();
  convosRef.current = conversations;

  let getMessageFunction = (convoID, sender, content, time, users) => {
    console.log(convosRef.current);
    if (!convosRef.current[convoID]) {
      let newConvo = {
        convoID: convoID,
        messages: [],
        members: users
      };
      dispatch({
        type: 'new-convo',
        content: { convoID: convoID, convo: newConvo }
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
      console.log('active login action');
      console.log(userInfo.fname);
      dispatch({ type: 'active-login', content: userInfo });
    });
    socket.on('active logout', userID => {
      console.log('active logout action');
      console.log(userID);
      dispatch({ type: 'active-logout', content: userID });
    });
    socket.on('send convo', (convoID, convo) => {
      console.log('send convo addding');
      dispatch({ type: 'new-convo', content: { convoID, convo } });
    });
    socket.on('get message', (convoID, sender, content, time, users) => {
      getMessageFunction(convoID, sender, content, time, users);
    });
    socket.on('new convo', (convoID, convo) => {
      console.log('send convo addding');
      dispatch({ type: 'new-convo', content: { convoID, convo } });
    });
    socket.on('video-rtc-answer-request', (offer, sender, convoID) => {
      console.log('video-rtc-answer-request');
      let openVideoChat = window.confirm(
        sender + ' is requesting a video Chat!'
      );
      if (openVideoChat) {
        dispatch({
          type: 'set-display-dialog',
          content: { set: true, convoID: convoID }
        });
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(stream => {
            console.log('pc.addStream()');
            pc.addStream(stream);
          })
          .catch(err => console.log('error', err));
        pc.setRemoteDescription(
          new sessionDescription(offer),
          () => {
            pc.createAnswer(
              answer => {
                pc.setLocalDescription(
                  new sessionDescription(answer),
                  () => {
                    socket.emit('video-rtc-answer', {
                      answer: answer,
                      to: sender
                    });
                  },
                  err => console.log('error', err)
                );
              },
              err => console.log('error', err)
            );
          },
          err => console.log('error', err)
        );
      }
    });
    pc.onaddstream = obj => {
      console.log('on add stream', obj);
      window.testStream = obj.stream;
      dispatch({ type: 'add-stream', content: obj.stream });
    };
    socket.on('video-rtc-answer-response', answer => {
      dispatch({ type: 'add-video-link' });
    });
  }, []);

  let renderHome = () => {
    return <Home />;
  };
  let renderMessenger = renderData => {
    console.log('render messenger');
    return <Messenger convoID={renderData.match.params.mid} />;
  };
  let renderVideoChat = renderData => {
    console.log('render video');
    return <VideoChat convoID={renderData.match.params.mid} />;
  };
  let renderMainMessenger = () => {
    console.log('render main messenger');
    return <Messenger />;
  };
  let renderProfile = renderData => {
    console.log('render profile');
    return <Profile userID={renderData.match.params.userID} />;
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
    let responseBody = await fetch('/check-cookies', { method: 'POST' });
    let responseText = await responseBody.text();
    let response = JSON.parse(responseText);
    if (response.success) {
      console.log('check cookies success');
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
  console.log('App.jsx');
  if (!login) {
    checkCookies();
  }
  console.log('App.jsx');
  return (
    <BrowserRouter>
      <Container loggedIn={login}>
        <SideNav />
        <TopNav />
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
            render={renderData => renderMainMessenger()}
          />
          <Route
            exact={true}
            path="/profile/:userID"
            render={renderData => renderProfile(renderData)}
          />
          <Route exact={true} path="/active-users" render={renderActiveUsers} />
          <Route exact={true} path="/login" render={renderLogin} />
          <Route exact={true} path="/register" render={renderRegister} />
        </Main>
      </Container>
    </BrowserRouter>
  );
};

export default App;
