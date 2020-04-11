import React, { Component } from 'react';
import {
  ImgBalls,
  ImgBall,
  RightArrow,
  LeftArrow,
  ImgDiv,
  SliderContainer,
  Slide
} from './ImageSliderStyle.jsx';

class ImageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: 'none',
      position: 0
    };
  }
  componentDidUpdate = prevProps => {
    if (prevProps.mainImage !== this.props.mainImage) {
      this.setState({ position: this.state.position });
    }
  };
  displayArrows = () => {
    this.setState({ toggle: 'block' });
    setTimeout(() => {
      this.setState({ toggle: 'none' });
    }, 1500);
  };

  shiftLeft = () => {
    if (this.state.position === 0) {
      return;
    }
    this.setState({ position: this.state.position - 1 });
  };

  shiftRight = () => {
    if (this.state.position === this.props.slides.length - 1) {
      return;
    }
    this.setState({ position: this.state.position + 1 });
  };

  render() {
    return (
      <SliderContainer onMouseEnter={this.displayArrows}>
        <LeftArrow toggle={this.state.toggle} onClick={this.shiftLeft}>
          <img src="/left-arrow.png" />
        </LeftArrow>
        <ImgDiv
          position={this.state.position}
          length={this.props.slides.length}
        >
          {this.props.slides.map((slide, index) => {
            return (
              <Slide key={'imgSlider' + index} slideStyle={slide}>
                <div>
                  <h1>{slide.title}</h1>
                  <p>{slide.title2}</p>
                </div>
                <img src={slide.imgPath} />
              </Slide>
            );
          })}
        </ImgDiv>
        <RightArrow toggle={this.state.toggle} onClick={this.shiftRight}>
          <img src="/right-arrow.png" />
        </RightArrow>
        <ImgBalls>
          {this.props.slides.map((img, index) => {
            return (
              <ImgBall
                onMouseEnter={() => this.setState({ position: index })}
                key={index}
                bc={index === this.state.position ? '#0064cf' : 'grey'}
              />
            );
          })}
        </ImgBalls>
      </SliderContainer>
    );
  }
}

export default ImageSlider;
