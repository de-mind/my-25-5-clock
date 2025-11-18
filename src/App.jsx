import * as React from "react";
import "./App copy.scss";

class MyTimer extends React.Component {
  state = {
    breakLength: 5,
    sessionLength: 25,
    timer: null, // 25 minutes in seconds
    intervalId: null,
    isSession: true, // true for session, false for break
    isRunning: false, // true if timer is running
    color: "hsla(0, 0%, 55%, 1)", // default color
  };

  timeInterval = () => {
    const timer = setInterval(() => {
      this.setState(
        (prevState) => ({
          timer: prevState.timer > 0 ? prevState.timer - 1 : 0,
        }),
        () => {
          this.setState({
            color: this.state.timer <= 60 ? "#8a1e1e" : "#13a402ff",
          });
          if (this.state.timer === 0) {
            this.warningHandler();
            this.clearTimeInterval();
            setTimeout(() => {
              this.breakSessionSwitch();
              this.setState({ isRunning: true }, () => this.timeInterval());
            }, 1000);
          }
        }
      );
    }, 100);
    this.setState({ intervalId: timer });
  };

  timeFormatter = (seconds) => {
    // Format seconds into MM:SS
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  startStopHandler = () => {
    this.setState((prevState) => ({
      isRunning: !prevState.isRunning,
    }));
  };

  resetHandler = () => {
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    this.clearTimeInterval();
    this.setState({
      isSession: true,
      isRunning: false,
      color: "hsla(0, 0%, 55%, 1)",
      breakLength: 1,
      sessionLength: 1,
      timer: this.state.sessionLength * 60,
    });
  };

  timerUpdater = () => {
    this.setState({
      timer: this.state.isSession
        ? this.state.sessionLength * 60
        : this.state.breakLength * 60,
    });
  };

  clearTimeInterval = () => {
    clearInterval(this.state.intervalId);
  };

  breakSessionSwitch() {
    this.setState(
      (prevState) => ({ isSession: !prevState.isSession }),
      () => {
        this.timerUpdater();
        console.log(this.state.isSession);
      }
    );
  }

  warningHandler = () => {
    //const audio = document.getElementById("beep");
    //audio.play();
  };

  decSessionHandler = () => {
    if (this.state.sessionLength > 1 && !this.state.isRunning) {
      this.setState(
        (prevState) => ({ sessionLength: prevState.sessionLength - 1 }),
        () => {}
      );
    }
  };

  incSessionHandler = () => {
    if (this.state.sessionLength < 60 && !this.state.isRunning) {
      this.setState((prevState) => ({
        sessionLength: prevState.sessionLength + 1,
      }));
    }
  };

  decBreakHandler = () => {
    if (this.state.breakLength > 1 && !this.state.isRunning) {
      this.setState(
        (prevState) => ({ breakLength: prevState.breakLength - 1 }),
        () => {}
      );
    }
  };

  incBreakHandler = () => {
    if (this.state.breakLength < 60 && !this.state.isRunning) {
      this.setState((prevState) => ({
        breakLength: prevState.breakLength + 1,
      }));
    }
  };

  componentDidMount() {
    this.setState({ timer: this.state.sessionLength * 60 });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.sessionLength !== this.state.sessionLength ||
      prevState.breakLength !== this.state.breakLength
    ) {
      this.timerUpdater();
    }

    if (prevState.isRunning !== this.state.isRunning) {
      this.state.isRunning ? this.timeInterval() : this.clearTimeInterval();
    }
  }

  componentWillUnmount() {
    this.clearTimeInterval();
  }

  render() {
    return (
      <div id="timer" className="clock-container">
        <div id="time-left">
          <span id="time-clock"> {this.timeFormatter(this.state.timer)}</span>
          <span
            id="timer-label"
            className={this.state.isSession ? "align-top" : "align-bottom"}
            style={{ color: this.state.color }}
          >
            {this.state.isSession ? "session" : "break"}
          </span>
          <audio
            id="beep"
            src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>

        <div className="length-controls">
          <div className="length-control">
            <span id="session-label" className="length-label">
              Session Length
            </span>
            <div className="length-buttons-vertical">
              <span id="session-length">{this.state.sessionLength}</span>
              <button id="session-increment" onClick={this.incSessionHandler}>
                +
              </button>
              <button id="session-decrement" onClick={this.decSessionHandler}>
                -
              </button>
            </div>
          </div>

          <div className="length-control">
            <span id="break-label" className="length-label">
              Break Length
            </span>
            <div className="length-buttons-vertical">
              <span id="break-length">{this.state.breakLength}</span>
              <button id="break-increment" onClick={this.incBreakHandler}>
                +
              </button>
              <button id="break-decrement" onClick={this.decBreakHandler}>
                -
              </button>
            </div>
          </div>
          <div className="clock-buttons">
            <button id="start_stop" onClick={this.startStopHandler}>
              Start/Stop
            </button>
            <button id="reset" onClick={this.resetHandler}>
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default MyTimer;
