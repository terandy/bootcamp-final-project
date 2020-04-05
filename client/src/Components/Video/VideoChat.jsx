import React, { useEffect, useState, useRef } from 'react';
import { socket } from '../Home/Login.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import VideoChatPage, { LilVid } from './VideoChatStyles.jsx';
import Popup from './Popup.jsx';
import Peer from 'simple-peer'; //each client is a peer, you will create a new instance of a peer

let VideoChat = props => {
  let dispatch = useDispatch();
  let history = useHistory();
  let convoID = props.convoID;
  let me = useSelector(state => state.userInfo.email);
  let activeUsers = useSelector(state => state.activeUsers);
  let activeUsersRef = useRef();
  activeUsersRef.current = activeUsers;
  let meRef = useRef();
  meRef.current = me;
  let peers = useSelector(state => state.peers);
  let peersRef = useRef();
  peersRef.current = peers;
  let videoChatInitiator = useSelector(state => state.videoChatInitiator);
  let [lilVidSize, setlilVidSize] = useState('medium');
  let [content, setContent] = useState('Welcome');
  let [person, setPerson] = useState('');
  let [show, setShow] = useState(false);
  let [myStream, setMyStream] = useState(false);
  let [otherStream, setOtherStream] = useState(false);
  let [peer, setPeer] = useState(false);

  useEffect(() => {
    if (convoID && me) {
      dispatch({ type: 'videoChatMode', content: true }); //to hide navbars
      socket.emit('video-chat-start', convoID, me);
    }
  }, [convoID, dispatch, me]);
  useEffect(() => {
    if (videoChatInitiator && convoID && me) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          //webRTC connection
          let peer = new Peer({
            initiator: videoChatInitiator === meRef.current ? true : false,
            trickle: false,
            stream: stream
          });
          //initiator calls function, others only call function on signal
          peer.on('signal', data => {
            console.log('signal', me);
            dispatch({
              type: 'set-peer',
              content: { data: JSON.stringify(data), user: me }
            });
            console.log('socket.emit(offer)');
            socket.emit('offer', data, me, convoID);
          });
          peer.on('stream', stream => {
            // set stream of other user
            setOtherStream(stream);
          });
          //get stream
          setMyStream(stream);
          let offerBack = (offerData, offerer, answerer, convoID) => {
            console.log('offerBack from', offerer);
            dispatch({
              type: 'set-peer',
              content: { data: JSON.stringify(offerData), user: offerer }
            });
            peer.signal(offerData);
          };
          socket.on('offerBack', offerBack);
          setPeer(peer);
        });
    }
  }, [videoChatInitiator, convoID, me]);
  useEffect(() => {
    socket.on('video-chat-decline-back', (convoID, decliner) => {
      setContent(' has declined invite.');
      setPerson(activeUsersRef.current[decliner].fname);
      setShow(true);
    });
  }, []);

  let endCall = () => {
    let end = window.confirm('You are about to leave video chat!');
    if (end) {
      dispatch({ type: 'videoChatMode', content: false });
      socket.emit('video-chat-leave', convoID, me);
      history.push('/messenger/' + convoID);
      if (myStream) {
        myStream.getTracks().map(val => {
          val.stop();
        });
      }
      socket.off('offerBack');
      if (peer) {
        peer.destroy();
      }
      dispatch({ type: 'destroy-peers' });
    }
  };
  let changelilVidSize = () => {
    if (lilVidSize === 'medium') {
      setlilVidSize('big');
    }
    if (lilVidSize === 'small') {
      setlilVidSize('medium');
    }
    if (lilVidSize === 'big') {
      setlilVidSize('small');
    }
  };
  return (
    <VideoChatPage>
      <div className="streams">
        <div className="big-vid">
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
        <LilVid size={lilVidSize} onClick={changelilVidSize}>
          <video
            key={'myvid'}
            autoPlay
            muted
            ref={vid => {
              if (!myStream || !vid) return;
              vid.srcObject = myStream;
            }}
          />
        </LilVid>
      </div>
      <div className="options">
        <img src="/end-call.png" onClick={endCall} alt="end-video-chat-icon" />
      </div>
      <Popup show={show} content={content} person={person} />
    </VideoChatPage>
  );
};
export default VideoChat;
