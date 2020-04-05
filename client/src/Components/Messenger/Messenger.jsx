import React, { useEffect } from 'react';
import MsgDisplay from './MsgDisplay.jsx';
import MsgDetail from './MsgDetail.jsx';
import MsgInput from './MsgInput.jsx';
import { socket } from './../Home/Login';
import styled from 'styled-components';
import ConvoList from './ConvoList.jsx';

let Div = styled.div`
  display: flex;
  height: 93vh;
`;
let MsgView = styled.div`
  background-color: white;
  border-radius: 1em;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 50px 1fr;
`;

let Messenger = props => {
  let thisConvoID = props.convoID;
  useEffect(() => {
    if (thisConvoID) {
      console.log('getConvo', thisConvoID);
      socket.emit('getConvo', thisConvoID);
    }
  }, [thisConvoID]);

  if (!props.convoID) {
    return (
      <Div>
        <ConvoList />
        <MsgView></MsgView>
      </Div>
    );
  }
  return (
    <Div>
      <ConvoList />
      <MsgView>
        <MsgDetail convoID={thisConvoID} />
        <MsgDisplay convoID={thisConvoID} />
        <MsgInput convoID={thisConvoID} />
      </MsgView>
    </Div>
  );
};

export default Messenger;
