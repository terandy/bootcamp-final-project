import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { pc, error } from '../../createOffer.js';

let Div = styled.div`
  height: 93vh;
`;

let VideoChat = props => {
  let dispatch = useDispatch();
  let thisConvoID = props.convoID;
  let streams = useSelector(state => state.streams);
  useEffect(() => {
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        pc.addStream(stream);
      },
      error
    );
    pc.onaddstream = obj => {
      dispatch({ type: 'add-stream', content: obj.stream });
    };
  }, []);
  if (!props.convoID) {
    return <Div></Div>;
  }
  return (
    <Div>
      <h1>Video Chat</h1>
      {streams.map((stream, index) => {
        return (
          <video
            key={'vid' + index}
            autoPlay
            ref={vid => {
              if (!vid) return;
              vid.srcObject = stream;
            }}
          />
        );
      })}
    </Div>
  );
};

export default VideoChat;
