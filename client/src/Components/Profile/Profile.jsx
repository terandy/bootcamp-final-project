import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ProfileImg,
  BackgroundImg,
  Container,
  EditPencil,
  Img2,
  Img1,
  Info,
  Cancel,
  Form1
} from './profileStyle.jsx';

let Profile = () => {
  let dispatch = useDispatch();
  let userInfo = useSelector(state => state.userInfo);
  const [fname, fnameChange] = useState('');
  const [lname, lnameChange] = useState('');
  const [email, emailChange] = useState('');
  const [description, descriptionChange] = useState('');
  const [hoverImg, hoverImgChange] = useState(2);
  const [displayInfo, displayInfoChange] = useState('info');
  const [hoverImgDisapear, hoverImgDisapearChange] = useState(false);
  useEffect(() => {
    fnameChange(userInfo.fname);
    lnameChange(userInfo.lname);
    emailChange(userInfo.email);
    descriptionChange(userInfo.description);
  }, [userInfo]);
  let profileSubmit = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append('description', description);
    data.append('fname', fname);
    data.append('lname', lname);
    data.append('userID', email);
    let responseBody = await fetch('/edit-profile', {
      method: 'POST',
      body: data
    });
    let responseText = await responseBody.text();
    let response = JSON.parse(responseText);
    if (response.success) {
      dispatch({
        type: 'edit-profile',
        content: {
          fname: fname,
          lname: lname,
          description: description
        }
      });
      displayInfoChange('info');
      hoverImgDisapearChange(false);
    }
  };
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
      console.log('ERROR - session not valid');
    }
  };
  if (!userInfo) {
    return <div>loading</div>;
  }
  return (
    <Container>
      <BackgroundImg>
        <div className="container">
          <img alt="profile-img" src={'/background.jpg'} />
        </div>
      </BackgroundImg>
      <ProfileImg>
        <div className="container">
          <img
            alt="profile-img"
            src={userInfo.imgSrc ? userInfo.imgSrc : '/default-profile-pic.png'}
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
      <Info displayInfo={displayInfo}>
        <h2>
          {userInfo.fname} {userInfo.lname}
        </h2>
        <p>{userInfo.description}</p>
      </Info>
      <Form1 onSubmit={profileSubmit} displayInfo={displayInfo}>
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
            type="text-area"
            value={description}
            onChange={evt => {
              descriptionChange(evt.target.value);
            }}
          />
        </div>
        <button>Make Changes</button>
        <Cancel
          onClick={() => {
            displayInfoChange('info');
            hoverImgDisapearChange(false);
          }}
          disapear={hoverImgDisapear}
        >
          Cancel
        </Cancel>
      </Form1>
      <EditPencil
        onMouseEnter={() => hoverImgChange(1)}
        onMouseLeave={() => hoverImgChange(2)}
        onClick={() => {
          displayInfoChange('form');
          hoverImgDisapearChange(true);
        }}
        disapear={hoverImgDisapear}
      >
        <Img1
          alt="pencil-edit"
          src={'/pencil-edit.png'}
          img={hoverImg}
          disapear={hoverImgDisapear}
        />
        <Img2
          alt="pencil-edit2"
          src={'/pencil-edit2.png'}
          img={hoverImg}
          disapear={hoverImgDisapear}
        />
      </EditPencil>
    </Container>
  );
};

export default Profile;
