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
  let [myStream, setMyStream] = useState(false);
  let streams = useSelector(state => state.streams);
  let me = useSelector(state => state.userInfo.email);
  let meRef = useRef();
  meRef.current = me;
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        console.log('addstream', meRef.current);
        setMyStream(stream);
        pc.addStream(stream);
      })
      .catch(error);

    pc.onaddstream = obj => {
      console.log('add stream');
      dispatch({ type: 'add-stream', content: obj.stream });
    };
  }, []);
  if (!props.convoID) {
    return <Div></Div>;
  }
  return (
    <Div>
      <h1>Video Chat</h1>
      <div>me</div>
      <video
        key={'myvid'}
        autoPlay
        muted
        ref={vid => {
          if (!vid || !myStream) return;
          vid.srcObject = myStream;
        }}
      />
      <div>other streams</div>
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
