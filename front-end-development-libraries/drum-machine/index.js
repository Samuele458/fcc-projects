//array of 9 drum machine sounds
const sounds = [
  {
    name: "Cowbell",
    url: "https://samuelegirgenti.it.nf/sounds/cowbell.mp3",
  },
  {
    name: "Crashcym",
    url: "https://samuelegirgenti.it.nf/sounds/crashcym.mp3",
  },
  {
    name: "Cym",
    url: "https://samuelegirgenti.it.nf/sounds/cym.mp3",
  },
  {
    name: "Handclap",
    url: "https://samuelegirgenti.it.nf/sounds/handclap.mp3",
  },
  {
    name: "Kick",
    url: "https://samuelegirgenti.it.nf/sounds/kick.mp3",
  },
  {
    name: "Snare",
    url: "https://samuelegirgenti.it.nf/sounds/snare.mp3",
  },
  {
    name: "Snare2",
    url: "https://samuelegirgenti.it.nf/sounds/snare2.mp3",
  },
  {
    name: "Tom",
    url: "https://samuelegirgenti.it.nf/sounds/tom1.mp3",
  },
  {
    name: "Tom2",
    url: "https://samuelegirgenti.it.nf/sounds/tom2.mp3",
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
        <p>{this.props.displayText}</p>
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

    this.handleClick = this.handleClick.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyPressed);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyPressed);
  }

  keyPressed(key) {
    if (key.key.toUpperCase() == this.props.keyChar) {
      this.handleClick();
    }
  }

  handleClick() {
    const audioElem = document.getElementById(this.props.keyChar);
    this.props.setDisplayText(this.props.sound.name);
    audioElem.play();
  }

  render() {
    return (
      <div
        className="drum-pad"
        id={this.props.sound.name}
        onClick={this.handleClick}
      >
        <audio id={this.props.keyChar} src={this.props.sound.url}></audio>
        {this.props.keyChar}
      </div>
    );
  }
}

//App component
class DrumMachineApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayText: "- - -",
    };

    this.setDisplayText = this.setDisplayText.bind(this);
  }

  setDisplayText(text) {
    this.setState({
      displayText: text,
    });
  }

  render() {
    const keys = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];
    let pads = [];

    //display.setText("ehe");
    pads = sounds.map((sound, i) => {
      return (
        <DrumPad
          sound={sound}
          keyChar={keys[i]}
          setDisplayText={this.setDisplayText}
        />
      );
    });

    return (
      <div id="drum-machine">
        <h1>Drum Machine</h1>
        <Display displayText={this.state.displayText} />
        <div id="tabs-box">{pads}</div>
      </div>
    );
  }
}

//render App
ReactDOM.render(<DrumMachineApp />, document.getElementById("app"));
