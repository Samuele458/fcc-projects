const keys = [
  {
    id: "zero",
    text: "0",
    type: "number",
  },
  {
    id: "one",
    text: "1",
    type: "number",
  },
  {
    id: "two",
    text: "2",
    type: "number",
  },
  {
    id: "three",
    text: "3",
    type: "number",
  },
  {
    id: "four",
    text: "4",
    type: "number",
  },
  {
    id: "five",
    text: "5",
    type: "number",
  },
  {
    id: "six",
    text: "6",
    type: "number",
  },
  {
    id: "seven",
    text: "7",
    type: "number",
  },
  {
    id: "eight",
    text: "8",
    type: "number",
  },
  {
    id: "nine",
    text: "9",
    type: "number",
  },
  {
    id: "add",
    text: "+",
    type: "operator",
  },
  {
    id: "multiply",
    text: "*",
    type: "operator",
  },
  {
    id: "divide",
    text: "/",
    type: "operator",
  },
  {
    id: "decimal",
    text: ".",
    type: "number",
  },
  {
    id: "minus",
    text: "-",
    type: "operator",
  },
  {
    id: "clear",
    text: "C",
    type: "operator",
  },
  {
    id: "equal",
    text: "=",
    type: "operator",
  },
];

class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="display">
        <div className="display-top">{this.props.formulaText}</div>
        <div className="display-bottom">{this.props.mainText}</div>
      </div>
    );
  }
}

Display.defaultProps = {
  formulaText: "-",
  mainText: "-",
};

class Button extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.handleClick(this.props.keyData);
  }

  render() {
    return (
      <div
        id={this.props.keyData.id}
        className="button"
        onClick={this.handleClick}
      >
        {this.props.keyData.text}
      </div>
    );
  }
}

//Calculator component
class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(key) {
    console.log(key);
  }

  render() {
    let buttons = keys.map((key) => (
      <Button keyData={key} handleClick={this.handleClick} />
    ));
    console.log("here");
    return (
      <div id="calculator">
        <Display />
        {buttons}
      </div>
    );
  }
}

//render calculator
ReactDOM.render(<Calculator />, document.getElementById("app"));
