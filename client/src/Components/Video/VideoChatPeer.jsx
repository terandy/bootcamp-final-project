import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Peer from 'simple-peer';
import { socket } from '../Home/Login.jsx';

let Div = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
  }
`;
let VideoMe = styled.video`
  width: 10%;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
`;
let VideoOther = styled.video`
  width: 90%;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
`;
let Button = styled.button`
  z-index: 100;
  height: 5em;
  border: none;
  background-color: transparent;
  &:hover {
    cursor: pointer;
    height: 5.5em;
  }
  img {
    height: 100%;
  }
`;
let Video1 = styled.video``;
let Video2 = styled.video``;
let VideoChatPeer = props => {
  let dispatch = useDispatch();
  let history = useHistory();
  let convoID = props.convoID;
  let [myStream, setMyStream] = useState(false);
  let [otherStream, setOtherStream] = useState(false);
  let user = useSelector(state => state.userInfo.email);
  let otherUser = useSelector(state => state.convoList[convoID].label);
  let userRef = useRef();
  userRef.current = user;
  let [client, setClient] = useState({});
  let clientRef = useRef();
  clientRef.current = client;
  useEffect(() => {
    dispatch({ type: 'videoChat', content: true });
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        //Sets this client's video Stream
        setMyStream(stream);

        //The server keeps track of members connected to the "webRTC connection"
        //S
        socket.emit('NewClient', convoID, user);

        //used to initialize a peer
        let InitPeer = type => {
          let peer = new Peer({
            initiator: type === 'init' ? true : false,
            stream: stream,
            trickle: false
          });
          // set a listener for when other members set there stream
          peer.on('stream', stream => {
            // set stream of other user
            setOtherStream(stream);
          });
          return peer;
        };
        let CreatePeer = () => {
          console.log('CreatePeer');
          // in the local state, we keep track of answers recieved.
          // thus we will start by setting gotAnswer = false
          let newClient = clientRef.current;
          newClient.gotAnswer = false;
          setClient(newClient);
          // make the webRTC connection & listen for stream.
          let peer = InitPeer('init');
          // if the peer is an init, the following will be called, else it waits for other signals
          peer.on('signal', data => {
            console.log('peer on signal');
            if (!clientRef.current.gotAnswer) {
              console.log('Offer');
              socket.emit('Offer', data, convoID, userRef.current);
            }
          });
          newClient.peer = peer;
          setClient(newClient);
        };
        let BackOffer = offer => {
          console.log('Backoffer');
          let peer = InitPeer('notInit');
          peer.on('signal', data => {
            socket.emit('Answer', data, convoID, userRef.current);
          });
          peer.signal(offer);
          let newClient = clientRef.current;
          newClient.peer = peer;
          setClient(newClient);
        };
        let BackAnswer = answer => {
          console.log('BackAnswer ie signalanswer');
          let newClient = clientRef.current;
          newClient.gotAnswer = true;
          setClient(newClient);
          let peer = newClient.peer;
          peer.signal(answer);
        };
        let RemovePeer = () => {
          if (client.peer) {
            client.peer.destroy();
            setClient({});
            dispatch({ type: 'videoChat', content: false });
            socket.off('BackOffer');
            socket.off('BackAnswer');
            socket.off('SessionActive');
            socket.off('CreatePeer');
            socket.off('Disconnect');
            socket.off('leaveVideoChat');
          }
        };
        let SessionActive = () => {
          console.log('already active');
        };

        socket.on('BackOffer', BackOffer);
        socket.on('BackAnswer', BackAnswer);
        socket.on('SessionActive', SessionActive);
        socket.on('CreatePeer', CreatePeer);
        socket.on('Disconnect', RemovePeer);
        socket.on('leaveVideoChat', RemovePeer);
      })
      .catch(err => {
        console.log('error', err);
      });
    socket.on('leaveVideoChat', () => {
      console.log('otherUser left conversation');
      setOtherStream(false);
    });
  }, []);
  let leaveVideoChat = () => {
    socket.emit('LeaveChat', otherUser, user, convoID);
    myStream.getTracks().map(val => {
      val.stop();
    });
    dispatch({ type: 'videoChat', content: false });
    history.push('/messenger');
  };
  return (
    <Div>
      <div className="container">
        <VideoOther
          key={'othervid'}
          autoPlay
          muted
          ref={vid => {
            if (!otherStream || !vid) return;
            vid.srcObject = otherStream;
          }}
        />
        <VideoMe
          key={'myvid'}
          autoPlay
          muted
          ref={vid => {
            if (!myStream || !vid) return;
            vid.srcObject = myStream;
          }}
        />
      </div>
      <Button onClick={leaveVideoChat}>
        <img src={'/end-call.png'} />
      </Button>
    </Div>
  );
};

export default VideoChatPeer;
