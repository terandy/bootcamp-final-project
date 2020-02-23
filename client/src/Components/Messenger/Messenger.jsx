import React from 'react';
import MsgDisplay from './MsgDisplay.jsx';
import MsgInput from './MsgInput.jsx';
import { socket } from './../Home/Login';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

let MsgView = styled.div`
  display: grid;
  grid-template-rows: 1fr 3em;
  height: 100%;
`;

let Messenger = props => {
  let dispatch = useDispatch();
  console.log('Messenger.jsx');
  let thisConvoID = props.convoID;
  socket.on('get message', (convoID, sender, content, time) => {
    console.log('new message action "got"');
    if (convoID === thisConvoID) {
      dispatch({
        type: 'get-message',
        content: { sender, content, time, convoID }
      });
    }
  });
  return (
    <MsgView>
      <MsgDisplay convoID={thisConvoID} />
      <MsgInput convoID={thisConvoID} />
    </MsgView>
  );
};

export default Messenger;
