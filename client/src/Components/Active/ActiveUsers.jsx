import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
let H1 = styled.h1`
  margin-left: 0.5em;
`;
let Container = styled.div`
  overflow: scroll;
`;
let ActiveUserStyle = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 1em;
  padding: 0.5em;
  margin: 0.5em;
  &:hover {
    cursor: pointer;
  }
  img {
    border-radius: 50%;
    height: 3em;
    width: 3em;
    object-fit: cover;
    margin-right: 0.5em;
  }
`;
let ActiveUsers = () => {
  const history = useHistory();
  let activeUsers = useSelector(state => state.activeUsers); // userID:{fname,image,description}
  let me = useSelector(state => state.userInfo.email);
  let viewProfile = async userID => {
    history.push('/view-profile/' + activeUsers[userID]._id);
  };
  return (
    <div>
      <H1>Active Users</H1>
      <Container>
        {Object.keys(activeUsers).map((userID, index) => {
          if (userID !== me) {
            return (
              <ActiveUserStyle
                key={'active-user' + index}
                onClick={() => viewProfile(userID)}
              >
                <img
                  alt=""
                  src={
                    activeUsers[userID].imgSrc
                      ? activeUsers[userID].imgSrc
                      : '/default-profile-pic.png'
                  }
                />
                <div>{activeUsers[userID].fname}</div>
              </ActiveUserStyle>
            );
          } else {
            return <div key={'non-active-user' + index}></div>;
          }
        })}
      </Container>
    </div>
  );
};

export default ActiveUsers;
