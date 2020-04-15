import React, { useEffect, useRef } from 'react';
import MsgDisplay from './MsgDisplay.jsx';
import MsgDetail from './MsgDetail.jsx';
import MsgInput from './MsgInput.jsx';
import { socket } from './../Home/Login';
import styled from 'styled-components';
import ConvoList from './ConvoList.jsx';

let Div = styled.div`
  height: 100%;
  @media screen and (max-width: 500px) {
    width: 200vw;
  }
  @media screen and (min-width: 500px) {
    width: 100%;
  }
  box-sizing: border-box;
  display: flex;
`;
let MsgViewStyle = styled.div`
  height: 100%;
  position: relative;
  @media screen and (max-width: 500px) {
    width: 50%;
  }
  @media screen and (min-width: 500px) {
    width: 100%;
  }
  box-sizing: border-box;
  & > div {
    box-sizing: border-box;
    background-color: white;
    border: lightgrey solid 1px;
    height: 100%;
    width: 100%;
    display: grid;
    position: absolute;
    top: 0;
    right: 0;
    grid-template-rows: 50px 1fr 40px;
  }
`;
let MsgView = props => {
  return (
    <MsgViewStyle>
      <div>
        <MsgDetail convoID={props.thisConvoID} />
        <MsgDisplay convoID={props.thisConvoID} />
        <MsgInput convoID={props.thisConvoID} />
      </div>
    </MsgViewStyle>
  );
};

let Messenger = props => {
  let thisConvoID = props.convoID;
  useEffect(() => {
    if (thisConvoID) {
      socket.emit('getConvo', thisConvoID);
    }
  }, [thisConvoID]);
  if (!props.convoID) {
    return (
      <Div>
        <ConvoList />
        <MsgViewStyle>
          <img
            src="/messenger-slide.jpeg"
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        </MsgViewStyle>
      </Div>
    );
  }
  return (
    <Div>
      <ConvoList />
      <MsgView thisConvoID={props.convoID} />
    </Div>
  );
};

export default Messenger;
