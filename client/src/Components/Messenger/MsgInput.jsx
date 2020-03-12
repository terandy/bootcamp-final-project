import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from './../Home/Login';
import { MsgInputStyle } from './MsgInputStyle.jsx';
import { Link } from 'react-router-dom';
import { pc } from '../Video/VideoChat.jsx';
const sessionDescription = window.RTCSessionDescription;
let MsgInput = props => {
  let dispatch = useDispatch();
  let formRef = useRef();
  let convoID = props.convoID;
  let members = useSelector(state => {
    if (state.conversations[convoID]) {
      return state.conversations[convoID].members;
    }
  });
  let [msgContent, setMsgContent] = useState('');
  let user = useSelector(state => state.userInfo.email);
  let convo = useSelector(state => state.conversations[convoID]);

  let submitHandler = async evt => {
    evt.preventDefault();
    socket.emit('new message', user, msgContent, convoID, convo.members);
    setMsgContent('');
    return;
  };

  let onChangeHandler = evt => {
    setMsgContent(evt.target.value);
    return;
  };
  let onEnterSubmit = evt => {
    if (evt.keyCode === 13) {
      submitHandler(evt);
    }
  };
  let sendOffer = () => {
    pc.createOffer(
      offer => {
        pc.setLocalDescription(
          new sessionDescription(offer),
          () => {
            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then(stream => {
                console.log('pc.addStream()');
                pc.addStream(stream);
              })
              .catch(err => console.log('error getUserMedia', err));
            console.log('make offer');
            socket.emit('video-rtc-offer', {
              offer: offer,
              members: members.filter(member => member !== user),
              sender: user,
              convoID: convoID
            });
          },
          err => console.log('error setLocalDescription', err)
        );
      },
      err => console.log('error createOffer', err)
    );
  };
  return (
    <MsgInputStyle onSubmit={submitHandler} ref={formRef}>
      <div>+</div>
      <Link to={'/video-chat/' + convoID} onClick={sendOffer}>
        <img alt="video-chat" src={'/video-chat.png'} />
      </Link>
      <textarea
        rows="1"
        type="text"
        value={msgContent}
        onChange={onChangeHandler}
        onKeyDown={onEnterSubmit}
        placeholder="Type a message..."
      />
      <button>
        <img alt="send" src={'/send-button.png'} />
      </button>
    </MsgInputStyle>
  );
};

export default MsgInput;
export { sessionDescription };
