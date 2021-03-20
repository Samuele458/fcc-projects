//Counter
class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  increment() {
    this.props.valueHandler(this.props.value + 1);
  }

  decrement() {
    this.props.valueHandler(this.props.value - 1);
  }

  render() {
    let counterName = this.props.counterName;

    return (
      <div className="counter">
        <p className="counter-title" id={`${counterName}-label`}>
          {this.props.counterName}
        </p>
        <div className="counter-content-box">
          <p className="counter-plus">
            <i
              id={`${counterName}-increment`}
              className="fas fa-plus"
              onClick={this.increment}
            ></i>
          </p>
          <p id={`${counterName}-length`} className="counter-number">
            {this.props.value}
          </p>
          <p className="counter-minus">
            <i
              id={`${counterName}-decrement`}
              className="fas fa-minus"
              onClick={this.decrement}
            ></i>
          </p>
        </div>
      </div>
    );
  }
}

//Timer component class
class Timer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="timer">
        <p id="timer-label">{this.props.label}</p>
        <p id="time-left">
          {this.props.mm}:{this.props.ss}
        </p>
      </div>
    );
  }
}

//Clock component class
class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionLength: 25,
      breakLength: 5,
      timerState: false,
      mm: 25,
      ss: 0,
      action: "session",
      intervalID: 0,
    };

    this.setSessionLength = this.setSessionLength.bind(this);
    this.setBreakLength = this.setBreakLength.bind(this);
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.timerNextStep = this.timerNextStep.bind(this);
  }

  setSessionLength(newSession) {
    if (!this.state.timerState && newSession > 0 && newSession <= 60) {
      if (this.state.action != "session") {
        this.setState({
          sessionLength: newSession,
        });
      } else {
        this.setState({
          mm: newSession,
          ss: 0,
          sessionLength: newSession,
        });
      }
    }
  }

  setBreakLength(newbreak) {
    if (!this.state.timerState && newbreak > 0 && newbreak <= 60) {
      if (this.state.action != "break") {
        this.setState({
          breakLength: newbreak,
        });
      } else {
        this.setState({
          mm: newbreak,
          ss: 0,
          breakLength: newbreak,
        });
      }
    }
  }

  startStopTimer() {
    console.log("state before trigger: ", this.state.timerState);
    console.log("start-stop triggered");
    console.log("IntervalID: ", this.state.intervalID);
    if (!this.state.timerState) {
      this.setState((state) => ({
        timerState: !state.timerState,
        intervalID: setInterval(this.timerNextStep, 1000),
      }));
    } else {
      if (this.state.intervalID != 0) {
        clearInterval(this.state.intervalID);
        this.setState({
          timerState: false,
        });
      }
    }
  }

  timerNextStep() {
    let mm = this.state.mm;
    let ss = this.state.ss;
    let action = this.state.action;

    if (mm == 0 && ss == 0) {
      if (action == "session") {
        action = "break";
        mm = this.state.breakLength;
      } else if (action == "break") {
        action = "session";
        mm = this.state.sessionLength;
      }
      ss = 0;
    }

    if (ss == 0) {
      mm--;
      ss = 59;
    } else {
      ss--;
    }
    console.log("dec");
    this.setState({
      mm: mm,
      ss: ss,
      action: action,
    });
  }

  resetTimer() {
    this.setState({
      sessionLength: 25,
      breakLength: 5,
      timerState: false,
    });
  }

  render() {
    let timer = (
      <Timer
        label="Session"
        state={this.state.timerState}
        mm={this.state.mm}
        ss={this.state.ss}
        action={this.state.action}
      />
    );

    return (
      <div id="clock">
        {timer}
        <div id="controls">
          <i className="fas fa-play" onClick={this.startStopTimer}></i>
          <i className="fas fa-stop" onClick={this.resetTimer}></i>
        </div>
        <div id="counters">
          <Counter
            counterName={this.state.action}
            value={this.state.sessionLength}
            valueHandler={this.setSessionLength}
          />
          <Counter
            counterName="break"
            value={this.state.breakLength}
            valueHandler={this.setBreakLength}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("app"));
