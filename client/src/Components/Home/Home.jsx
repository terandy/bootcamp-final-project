import React from 'react';
import { useDispatch } from 'react-redux';
import { socket } from './Login.jsx';

let Home = props => {
  let dispatch = useDispatch();

  //Listening for events
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
  console.log('Home.jsx');
  return <div></div>;
};

export default Home;
