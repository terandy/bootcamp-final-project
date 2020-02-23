import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from './../Home/Login';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

let Container = styled.div`
  background-color: lightyellow;
  grid-area: side;
  display: ${props => (props.loggedIn ? 'grid' : 'none')};
  grid-template-rows: 2em 2em 3fr;
`;

let LeftNav = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  let convoList = useSelector(state => state.convoList);
  let loggedIn = useSelector(state => state.login);
  socket.on('send convo', (convoID, convo) => {
    dispatch({ type: 'new-convo-ConvoList', content: { convoID } });
  });
  let getConvo = convoID => {
    console.log('start convo');
    socket.emit('getConvo', convoID);
    socket.on('send convo', (convoID, convo) => {
      history.push('/messenger/' + convoID);
    });
  };
  if (!convoList) {
    return <div></div>;
  }
  return (
    <Container loggedIn={loggedIn}>
      ConvoList
      <Link to="/active-users">find users</Link>
      {Object.keys(convoList).map((convoID, index) => {
        return (
          <div key={index} onClick={() => getConvo(convoID)}>
            <div>{convoList[convoID].label}</div>
          </div>
        );
      })}
    </Container>
  );
};

export default LeftNav;
