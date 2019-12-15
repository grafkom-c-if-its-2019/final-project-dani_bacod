import React, { Component } from 'react';
import { controls } from '../game/main';
import MuteButton from './MuteButton';

class Blocker extends Component {
  constructor(props) {
    super(props);
    this.state = { instructions: true };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const element = document.body;
    const blocker = this.refs.blocker;
    const instructions = this.refs.instructions;

    const pointerlockchange = (event) => {
      if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
        controls.enabled = true;
        blocker.style.display = 'none';
      } else { // EXIT SCREEN
        controls.enabled = false;
        blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';
        instructions.style.display = '';
        this.setState({ instructions: true });
      }
    }

    document.addEventListener('pointerlockchange', pointerlockchange, false);
  }

  handleClick(evt) {
    const element = document.body;

    /*----- ASKS BROWSER TO LOCK POINTER -----*/
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    element.requestPointerLock();
    this.setState({ instructions: false });
  }

  render() {
    return (
      <div id="blocker" ref="blocker">
        { this.state.instructions &&
          <div id="instructions" ref="instructions" onClick={this.handleClick}>
            <span className='blocker-title'>Klik untuk Bermain</span>
            <br />
            <span className='blocker-instruction-controls'>(W,A,S,D = Jalan, MOUSE = Kamera, CLICK = Lempar Bom)</span>
            <br />
            <span className='blocker-instruction-controls'>(ENTER = Buka Chat, ` = Tutup chat, ESC = Instruksi)</span>
            <br />
            <br />
            <br />
            <br />
            <br />

            <span className='blocker-instruction-controls'> Tips: </span>
            <br />
              <span className='blocker-instruction-tips'>Kotak kayu bisa hancur jika terkena bomb</span>
              <br />
              <br />
              <span className='blocker-instruction-tips'>Batu tidak bisa hancur terkena bomb. Jadi berlindunglah di balik batu.</span>
              <br />
              <br />
              <span className='blocker-instruction-tips'>Kamu bisa melempar bomb untuk memindahkan bomb dari lawan</span>
              <br />
              <br />
              <span className='blocker-instruction-tips'>Hati-hati. JANGAN BUNDIR!</span>
            <br />
          </div>}
        <MuteButton />
      </div>
    )
  }
}

export default Blocker;
