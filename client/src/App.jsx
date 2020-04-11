//Librairies
import React, { useEffect, useRef } from 'react';
import { Route, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from './Components/Home/Login.jsx';
//Compononents
import Messenger from './Components/Messenger/Messenger.jsx';
import VideoChat from './Components/Video/VideoChat.jsx';
import Profile from './Components/Profile/Profile.jsx';
import OtherProfile from './Components/Profile/OtherProfile.jsx';
import ActiveUsers from './Components/Active/ActiveUsers.jsx';
import Home from './Components/Home/Home.jsx';
import Login from './Components/Home/Login.jsx';
import Register from './Components/Home/Register.jsx';
import SideNav from './Components/Navbar/SideNav.jsx';
import TopNav from './Components/Navbar/TopNav.jsx';
import { SIDE_BAR_WIDTH, TOP_BAR_HEIGHT } from './data.js';

let Container = styled.div``;
let MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  min-width: 300px;
  @media screen and (max-width: 500px) {
    width: ${props => (props.messenger ? '200vw' : '100vw')};
  }
  @media screen and (min-width: 500px) {
    width: 100vw;
  }
`;
let Main = styled.div`
  box-sizing: border-box;
  padding-top: ${props => (props.videoChatMode ? '0' : TOP_BAR_HEIGHT + 'px')};
  @media screen and (max-width: 500px) {
    padding-bottom: ${props =>
      props.videoChatMode || !props.loggedIn ? '0' : SIDE_BAR_WIDTH + 'px'};
  }
  @media screen and (min-width: 500px) {
    padding-left: ${props =>
      props.videoChatMode || !props.loggedIn ? '0' : SIDE_BAR_WIDTH + 'px'};
  }
  width: 100%;
  height: 100%;
`;
let App = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let me = useSelector(state => state.userInfo.email);
  let videoChatInvite = useSelector(state => state.videoChatInvite);
  let login = useSelector(state => state.login);
  let conversations = useSelector(state => state.conversations);
  let videoChatMode = useSelector(state => state.videoChatMode);
  let convosRef = useRef();
  let meRef = useRef();
  meRef.current = me;
  convosRef.current = conversations;
  let peers = useSelector(state => state.peers);
  let peersRef = useRef();
  peersRef.current = peers;
  //Listening for events
  useEffect(() => {
    let getMessageFunction = (
      convoID,
      sender,
      content,
      time,
      users,
      arrayOfUsersInfo
    ) => {
      if (!convosRef.current[convoID]) {
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
    socket.on('active login', userInfo => {
      dispatch({ type: 'active-login', content: userInfo });
    });
    socket.on('active logout', userID => {
      dispatch({ type: 'active-logout', content: userID });
    });
    socket.on('send convo', (convoID, convo, arrayOfMemberInfo) => {
      dispatch({
        type: 'new-convo',
        content: { convoID, convo, arrayOfMemberInfo }
      });
    });
    socket.on(
      'get message',
      (convoID, sender, content, time, users, arrayOfUsersInfo) => {
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
    socket.on('active-user-edit', userInfo => {
      if (userInfo.email !== me) {
        dispatch({
          type: 'update-active-user',
          content: { userID: userInfo.email, userInfo: userInfo }
        });
      }
    });
    socket.on('new convo', (convoID, convo, arrayOfMemberInfo) => {
      dispatch({
        type: 'new-convo',
        content: { convoID, convo, arrayOfMemberInfo }
      });
    });
    socket.on('video-chat-initiator', initiator => {
      dispatch({ type: 'video-chat-initiator', content: { initiator } });
    });
    socket.on('video-chat-start-invite', convoID => {
      dispatch({
        type: 'video-chat-start-invite',
        content: { convoID }
      });
    });
  }, [dispatch]);
  useEffect(() => {
    if (videoChatInvite.start) {
      if (window.confirm('join videoChat?')) {
        history.push('/video-chat/' + videoChatInvite.convoID);
      } else {
        socket.emit('video-chat-decline', videoChatInvite.convoID, me);
      }
      dispatch({ type: 'reset-chat-start-invite' });
    }
  }, [videoChatInvite, me, dispatch, history]);

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

  useEffect(() => {
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
  }, [login, dispatch]);
  return (
    <Container loggedIn={login}>
      <TopNav />
      <MainContainer messenger={window.location.href.includes('messenger')}>
        <SideNav />
        <Main videoChatMode={videoChatMode} loggedIn={login}>
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
