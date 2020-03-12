import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from './../Home/Login';
import styled from 'styled-components';

let Div = styled.div`
  height: 93vh;
`;
const peerConnection = window.RTCPeerConnection;
var pc = new peerConnection({
  iceServers: [
    {
      url: 'stun:stun.services.mozilla.com'
    }
  ]
});

let VideoChat = props => {
  console.log('VideoChat.jsx');
  let dispatch = useDispatch();
  let thisConvoID = props.convoID;
  let streams = useSelector(state => state.streams);
  let [test, updateTest] = useState('');
  useEffect(() => {
    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then(stream => {
    //     updateTest(stream);
    //     window.cameraStream = stream;
    //   });
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
              debugger;
              vid.srcObject = stream;
            }}
          />
        );
      })}
      {/* {test && (
        <video
          key={'vid'}
          autoPlay
          ref={vid => {
            if (!vid) return;
            vid.srcObject = test;
          }}
        />
      )} */}
    </Div>
  );
};

export default VideoChat;
export { pc };
