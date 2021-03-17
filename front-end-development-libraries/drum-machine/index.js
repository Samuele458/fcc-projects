//array of 9 drum machine sounds
const sounds = [
  {
    name: "Cowbell",
    url: "http://samuelegirgenti.it.nf/sounds/cowbell.mp3",
  },
  {
    name: "Crashcym",
    url: "http://samuelegirgenti.it.nf/sounds/crashcym.mp3",
  },
  {
    name: "Cym",
    url: "http://samuelegirgenti.it.nf/sounds/cym.mp3",
  },
  {
    name: "Handclap",
    url: "http://samuelegirgenti.it.nf/sounds/handclap.mp3",
  },
  {
    name: "Kick",
    url: "http://samuelegirgenti.it.nf/sounds/kick.mp3",
  },
  {
    name: "Snare",
    url: "http://samuelegirgenti.it.nf/sounds/snare.mp3",
  },
  {
    name: "Snare2",
    url: "http://samuelegirgenti.it.nf/sounds/snare2.mp3",
  },
  {
    name: "Tom",
    url: "http://samuelegirgenti.it.nf/sounds/tom1.mp3",
  },
  {
    name: "Tom2",
    url: "http://samuelegirgenti.it.nf/sounds/tom2.mp3",
  },
];

//Display
class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="display">
        <p>{this.props.text}</p>
      </div>
    );
  }
}

//default text message for display
Display.defaultProps = {
  text: "-",
};

//Drum pad component
class DrumPad extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="drum-pad" id={this.props.sound.name}>
        <p>A</p>
      </div>
    );
  }
}

//App component
class DrumMachineApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let pads = [];

    pads = sounds.map((sound) => {
      return <DrumPad sound={sound} />;
    });

    return (
      <div id="drum-machine">
        <h1>Drum Machine</h1>
        <Display />
        <div id="tabs-box">{pads}</div>
      </div>
    );
  }
}

//render App
ReactDOM.render(<DrumMachineApp />, document.getElementById("app"));
