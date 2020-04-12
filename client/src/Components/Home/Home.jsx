import React from 'react';
import ImageSlider from '../Slider/ImageSlider.jsx';
import styled from 'styled-components';
import { SIDE_BAR_WIDTH } from '../../data.js';
let slides = [
  {
    color: '#7CB9E8',
    title: 'Welcome!',
    title2:
      'Experience a dynamic user interface, built with React.js and a Node.js web server, hosted by Heroku.'
  },
  {
    color: 'rgb(253,193,49)',
    title: 'Discover new people!',
    title2:
      'See who is currently online, and view their profile. Information is saved on a MongoDB database',
    imgPath: '/discover-slide.jpg'
  },
  {
    color: '#2177B6',
    title: 'Chat with users!',
    title2: 'Messages update instantly, using WebSocket technology.',
    imgPath: '/messenger-slide.jpeg'
  },
  {
    color: 'rgb(150,85,183)',
    title: 'Video chat!',
    title2: 'Connect directly to peers, using WebRTC.',
    imgPath: '/video-chat-slide.png'
  }
];

let Div = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .innerDiv {
    width: 100%;
    height: 100%;
    /* @media screen and (min-width: 800px) {
      padding: 0 ${SIDE_BAR_WIDTH}px;
    } */
  }
`;
let Home = () => {
  return (
    <Div>
      <div className="innerDiv">
        <ImageSlider slides={slides} />
      </div>
    </Div>
  );
};

export default Home;
