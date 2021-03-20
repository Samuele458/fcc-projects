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
        <p id="time-left">10:23</p>
        <div id="controls">
          <i className="fas fa-play"></i>
          <i className="fas fa-stop"></i>
        </div>
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
    };

    this.setSessionLength = this.setSessionLength.bind(this);
    this.setBreakLength = this.setBreakLength.bind(this);
  }

  setSessionLength(newSession) {
    if (newSession >= 0)
      this.setState({
        sessionLength: newSession,
      });
  }

  setBreakLength(newbreak) {
    if (newbreak >= 0)
      this.setState({
        breakLength: newbreak,
      });
  }

  render() {
    return (
      <div id="clock">
        <Timer label="Session" />
        <div id="counters">
          <Counter
            counterName="session"
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
