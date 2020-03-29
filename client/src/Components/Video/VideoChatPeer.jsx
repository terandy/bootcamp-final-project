import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Peer from 'simple-peer';
import { socket } from '../Home/Login.jsx';
import MsgDetail from '../Messenger/MsgDetail.jsx';
let Div = styled.div`
  display: flex;
  height: 100%;
`;
let Button = styled.button``;
let Video1 = styled.video``;
let Video2 = styled.video``;
let VideoChatPeer = props => {
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
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setMyStream(stream);
        socket.emit('NewClient', convoID, user);
        //used to initialize a peer
        let InitPeer = type => {
          let peer = new Peer({
            initiator: type === 'init' ? true : false,
            stream: stream,
            trickle: false
          });
          peer.on('stream', stream => {
            setOtherStream(stream);
          });
          return peer;
        };
        let MakePeer = () => {
          console.log('CreatePeer ie MakePeer');
          let newClient = clientRef.current;
          newClient.gotAnswer = false;
          setClient(newClient);
          let peer = InitPeer('init');
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
        let FrontAnswer = offer => {
          console.log('Backoffer ie frontAnsewer');
          let peer = InitPeer('notInit');
          peer.on('signal', data => {
            socket.emit('Answer', data, convoID, userRef.current);
          });
          peer.signal(offer);
          let newClient = clientRef.current;
          newClient.peer = peer;
          setClient(newClient);
        };
        let SignalAnswer = answer => {
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
          }
        };

        socket.on('BackOffer', FrontAnswer);
        socket.on('BackAnswer', SignalAnswer);
        socket.on('SessionActive', () => console.log('already active'));
        socket.on('CreatePeer', MakePeer);
        socket.on('Disconnect', RemovePeer);
        socket.on('LeaveChat', RemovePeer);
      })
      .catch(err => {
        console.log('error', err);
      });
  }, []);
  useEffect(() => {
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

    history.push('/messenger');
  };
  return (
    <div>
      <MsgDetail convoID={convoID} />
      <Div>
        <div>
          <div>me</div>
          <video
            key={'myvid'}
            autoPlay
            muted
            ref={vid => {
              if (!myStream || !vid) return;
              vid.srcObject = myStream;
            }}
          />
          <Button onClick={leaveVideoChat}>Leave Video Chat</Button>
          <div>others</div>
          <video
            key={'othervid'}
            autoPlay
            muted
            ref={vid => {
              if (!otherStream || !vid) return;
              vid.srcObject = otherStream;
            }}
          />
        </div>
      </Div>
    </div>
  );
};

export default VideoChatPeer;
