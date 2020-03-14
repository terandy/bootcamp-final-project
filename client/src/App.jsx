//Librairies
import React, { useEffect, useRef, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from './Components/Home/Login.jsx';
import createOffer, { pc, sessionDescription, error } from './createOffer.js';
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
  const history = useHistory();
  const dispatch = useDispatch();
  let answersFrom = useSelector(state => state.answersFrom);
  let answersFromRef = useRef();
  let [answer, setAnswer] = useState(false);
  let answerRef = useRef();
  answerRef.current = answer;
  answersFromRef.current = answersFrom;
  let login = useSelector(state => state.login);
  let conversations = useSelector(state => state.conversations);
  let convosRef = useRef();
  convosRef.current = conversations;

  let getMessageFunction = (convoID, sender, content, time, users) => {
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
      dispatch({ type: 'active-login', content: userInfo });
    });
    socket.on('active logout', userID => {
      dispatch({ type: 'active-logout', content: userID });
    });
    socket.on('send convo', (convoID, convo) => {
      dispatch({ type: 'new-convo', content: { convoID, convo } });
    });
    socket.on('get message', (convoID, sender, content, time, users) => {
      getMessageFunction(convoID, sender, content, time, users);
    });
    socket.on('new convo', (convoID, convo) => {
      dispatch({ type: 'new-convo', content: { convoID, convo } });
    });
    socket.on('offer-made', (offer, members, convoID, offerer, reciever) => {
      console.log('offer-made listening from', offerer);
      console.log('offer-made listening to', reciever);
      if (!answerRef.current) {
        let yes = window.confirm(offerer + ' wants to start a video chat');
        setAnswer(yes);
        history.push('/video-chat/' + convoID);
      }
      pc.setRemoteDescription(
        new sessionDescription(offer),
        () => {
          pc.createAnswer(answer => {
            pc.setLocalDescription(
              new sessionDescription(answer),
              () => {
                socket.emit(
                  'make-answer',
                  answer,
                  members,
                  convoID,
                  offerer,
                  reciever
                );
              },
              error
            );
          }, error);
        },
        error
      );
    });
    socket.on('answer-made', (answer, members, convoID, offerer, reciever) => {
      console.log('answer-made listening');
      pc.setRemoteDescription(
        new sessionDescription(answer),
        () => {
          if (!answersFromRef.current[reciever]) {
            createOffer(convoID, members, offerer);
            console.log('answerer', reciever);
            dispatch({ type: 'add-to-answersFrom', content: reciever });
          }
        },
        error
      );
    });
  }, []);

  let renderHome = () => {
    return <Home />;
  };
  let renderMessenger = renderData => {
    return <Messenger convoID={renderData.match.params.mid} />;
  };
  let renderVideoChat = renderData => {
    return <VideoChat convoID={renderData.match.params.mid} />;
  };
  let renderMainMessenger = () => {
    return <Messenger />;
  };
  let renderProfile = renderData => {
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
  if (!login) {
    checkCookies();
  }
  return (
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
  );
};

export default App;
