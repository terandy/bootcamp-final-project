import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

let ProfileImg = styled.label`
  .container {
    position: relative;
    height: 200px;
    width: 200px;
    &:hover {
      cursor: pointer;
      div {
        display: flex;
      }
    }
    input {
      display: none;
    }
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    div {
      border-radius: 50%;
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: none;
      color: white;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
`;
let Profile = props => {
  let dispatch = useDispatch();
  let userInfo = useSelector(state => state.userInfo);
  const [fname, fnameChange] = useState('');
  const [lname, lnameChange] = useState('');
  const [description, descriptionChange] = useState('');
  let imgSubmit = async evt => {
    let data = new FormData();
    data.append('imgSrc', evt.target.files[0]);
    data.append('userID', userInfo.email);
    let responseBody = await fetch('/edit-profile-img', {
      method: 'POST',
      body: data
    });
    let responseText = await responseBody.text();
    let response = JSON.parse(responseText);
    if (response.success) {
      dispatch({
        type: 'edit-profile-img',
        content: {
          imgSrc: response.imgSrc
        }
      });
    } else {
      console.log('session not valid');
    }
  };
  if (!userInfo) {
    return <div>loading</div>;
  }
  return (
    <div>
      <div>
        <h1>Profile</h1>
        <ProfileImg>
          <div className="container">
            <img
              alt="profile-img"
              src={
                userInfo.imgSrc ? userInfo.imgSrc : '/default-profile-pic.png'
              }
            />
            <div>Edit Image</div>
            <input
              type="file"
              onChange={evt => {
                imgSubmit(evt);
              }}
            />
          </div>
        </ProfileImg>
        <h2>
          {userInfo.fname} {userInfo.lname}
        </h2>
        <p>{userInfo.description}</p>
      </div>
      <form>
        <h1>Edit Profile</h1>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={fname}
            onChange={evt => {
              fnameChange(evt.target.value);
            }}
          />
        </div>
        <div>
          <label>Last Name</label>{' '}
          <input
            type="text"
            value={lname}
            onChange={evt => {
              lnameChange(evt.target.value);
            }}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={evt => {
              descriptionChange(evt.target.value);
            }}
          />
        </div>
        <button>Make Changes</button>
      </form>
    </div>
  );
};

export default Profile;
