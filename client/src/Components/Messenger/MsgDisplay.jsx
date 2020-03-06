import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
let MsgDisplayStyle = styled.div`
  overflow: scroll;
  padding: 00.5em;
`;
let Container = styled.div`
  text-align: ${props => (props.me ? 'right ' : 'left')};
  align-content: ${props => (props.me ? 'right ' : 'left')};
`;
let TextBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.me ? 'flex-end' : 'flex-start')};
  div {
    background-color: ${props => (props.me ? 'lightgrey' : 'purple')};
    color: ${props => (props.me ? 'black' : 'white')};
    padding: 1em;
    width: max-content;
    min-width: 25px;
    max-width: 75%;
    border-radius: ${props =>
      props.me ? '1.5em 1.5em 0 1.5em' : '1.5em 1.5em 1.5em 0'};
    text-align: left;
    overflow-wrap: break-word;
    word-wrap: break-word;
    margin-left: 2.5em;
  }
`;
let Sender = styled.div`
  position: relative;
  img {
    display: ${props => (props.me || props.notYet ? 'none' : 'block')};
    position: absolute;
    top: 1em;
    left: 0;
    height: 2em;
    width: 2em;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 1em;
  }
`;

let TimeStyle = styled.div`
  color: grey;
  text-align: center;
  display: ${props => (props.notYet ? 'none' : 'block')};
`;
let DayStyle = styled(TimeStyle)`
  padding: 1em 0;
`;
let MsgDisplay = props => {
  let containerRef = useRef();
  let convoID = props.convoID;
  let convo = useSelector(state => state.conversations[convoID]);
  let convoUsers = useSelector(state => state.convoUsers);
  let myID = useSelector(state => state.userInfo.email);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, [convo]);
  if (!convo) {
    return <div></div>;
  }
  return (
    <MsgDisplayStyle ref={containerRef}>
      {convo.messages.map((msg, index) => {
        let me = myID === msg.sender;
        let notYet = { time: true, day: true, sender: true };
        let time = new Date(msg.time);
        let day = time.getDay();
        let timeBefore =
          index === 0 ? 0 : new Date(convo.messages[index - 1].time);
        let senderBefore = index === 0 ? 0 : convo.messages[index - 1].sender;
        let dayBefore = index === 0 ? 0 : timeBefore.getDay();
        let timeDistance = time - timeBefore;
        if (senderBefore !== msg.sender || timeDistance > 600000) {
          notYet.sender = false;
        }
        if (timeDistance > 600000) {
          notYet.time = false;
        }
        if (day - dayBefore >= 1) {
          notYet.day = false;
        }
        return (
          <Container me={me} key={index}>
            <DayStyle notYet={notYet.day}>{time.toDateString()}</DayStyle>
            <TimeStyle notYet={notYet.time}>
              {time.toLocaleTimeString('en-US', {
                hour: 'numeric',
                hour12: true,
                minute: 'numeric'
              })}
            </TimeStyle>
            <div>
              <Sender me={me} notYet={notYet.sender}>
                <img
                  alt=""
                  src={
                    convoUsers[msg.sender] && convoUsers[msg.sender].imgSrc
                      ? convoUsers[msg.sender].imgSrc
                      : '/default-profile-pic.png'
                  }
                />

                <TextBubble me={me}>
                  <div>{msg.content}</div>
                </TextBubble>
              </Sender>
            </div>
          </Container>
        );
      })}
    </MsgDisplayStyle>
  );
};

export default MsgDisplay;
