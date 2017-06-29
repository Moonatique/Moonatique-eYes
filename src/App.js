import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.conf = {
      dt: 20
    };

    this.const = {
      eye1: {x: 15, y: 15, width: 10, height: 10},
      eye2: {x: 30, y: 15, width: 10, height: 10}
    };

    this.state = {
      eye1: this.const.eye1,
      eye2: this.const.eye2,
      followerPos: {top: 0, left: 0}
    };
    this.updateMousePos = this.updateMousePos.bind(this);
    this.follower = null;
    this.followerPos = null;
  }

  componentDidMount() {
    const {top, left} = this.follower.getBoundingClientRect();
    this.setState(prevState => ({...prevState, followerPos: {top, left}}));
  }

  updateMousePos(e) {
    e.persist();
    e.stopPropagation();
    const mousePos = {mouseX: e.pageX, mouseY: e.pageY};
    const eye1 = this.updateEyePos(mousePos, this.const.eye1, this.conf.dt, this.state.followerPos);
    const eye2 = this.updateEyePos(mousePos, this.const.eye2, this.conf.dt, this.state.followerPos);
    if (eye1 && eye2) {
      this.setState(prevState => ({...prevState, eye1, eye2}));
    }
  }

  updateEyePos({mouseX, mouseY}, {x, y}, dt, {top, left}) {
    const d = Math.sqrt(Math.pow(mouseX - x + left, 2) + Math.pow(mouseY - y + top, 2));
    if (d === 0 || isNaN(d)) {
      return false;
    }
    const t = dt / d;
    const resultX = Math.floor(((1 - t) * (x + left)) + (t * mouseX) - left);
    const resultY = Math.floor(((1 - t) * (y + top)) + (t * mouseY) - top);
    if (isNaN(x) || isNaN(y)) {
      return false;
    }
    return {x: resultX, y: resultY};
  }

  getEyeStyle(eye) {
    return {
      top: `${eye.y}px`,
      left: `${eye.x}px`,
      width: `${eye.width}px`,
      height: `${eye.height}px`,
    };
  }

  render() {
    const styleEye1 = this.getEyeStyle(this.state.eye1);
    const styleEye2 = this.getEyeStyle(this.state.eye2);

    return (
      <div className="App" onMouseMove={this.updateMousePos}>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
          <div className="moon-follower" ref={(el) => { this.follower = el; }} >
            <Mooneye eyeStyle={styleEye1} />
            <Mooneye eyeStyle={styleEye2} />
          </div>
        </div>
        <p className="App-intro">
          Mouse your mouse, you are spotted !!!!
        </p>
      </div>
    );
  }
}

const Mooneye = (props) => (
  <div className="moon-eyes" style={props.eyeStyle}>
    <span className="moon-pupil"></span>
  </div>
)

export default App;
