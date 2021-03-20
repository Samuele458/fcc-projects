//Counter
class Counter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let counterName = this.props.counterName;

    return (
      <div className="counter">
        <p className="counter-title" id={`${counterName}-label`}>
          Counter
        </p>
        <div className="counter-content-box">
          <p className="counter-plus">
            <i id={`${counterName}-increment`} className="fas fa-plus"></i>
          </p>
          <p id={`${counterName}-length`} className="counter-number">
            25
          </p>
          <p className="counter-minus">
            <i id={`${counterName}-decrement`} className="fas fa-minus"></i>
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
  }

  render() {
    return (
      <div id="clock">
        <Timer label="Session" />
        <div id="counters">
          <Counter counterName="session" />
          <Counter counterName="break" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("app"));
