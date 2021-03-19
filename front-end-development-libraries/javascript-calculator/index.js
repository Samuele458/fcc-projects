/*
 *    Author:       Samuele Girgenti
 *    Date:         19 / 03 / 2021
 */

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
    type: "decimal",
  },
  {
    id: "subtract",
    text: "-",
    type: "operator",
  },
  {
    id: "clear",
    text: "C",
    type: "clear",
  },
  {
    id: "equals",
    text: "=",
    type: "equals",
  },
];

class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="display-box">
        <div className="display-top">{this.props.formulaText}</div>
        <div id="display">{this.props.mainText}</div>
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

    this.state = {
      displayMainText: "0",
      displayFormulaText: "",
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(key) {
    if (key.type == "decimal") {
      if (
        !isNaN(this.state.displayMainText) &&
        this.state.displayMainText.indexOf(".") == -1
      ) {
        this.setState((state) => ({
          displayMainText: state.displayMainText + key.text,
        }));
      }
    }

    if (key.type == "number") {
      if (!isNaN(this.state.displayMainText)) {
        if (this.state.displayMainText == "0") {
          this.setState({
            displayMainText: key.text,
          });
        } else {
          this.setState((state) => ({
            displayMainText: state.displayMainText + key.text,
          }));
        }
      } else {
        this.setState((state) => ({
          displayMainText: key.text,
          displayFormulaText: state.displayFormulaText + state.displayMainText,
        }));
      }
    }

    if (key.type == "operator") {
      let lastToken = this.state.displayFormulaText[
        this.state.displayFormulaText.length - 1
      ];

      console.log(this.state.displayFormulaText, "Tokens: ", lastToken);
      if (
        !isNaN(this.state.displayMainText) ||
        (key.text == "-" && this.state.displayMainText != "-")
      ) {
        this.setState((state) => ({
          displayMainText: key.text,
          displayFormulaText: state.displayFormulaText + state.displayMainText,
        }));
      } else {
        let currentText = this.state.displayFormulaText;
        let newText = "";
        let i;
        for (i = currentText.length - 1; i >= 0; --i) {
          if (!isNaN(parseInt(currentText[i]))) {
            break;
          }
        }
        newText = currentText.slice(0, i + 1);
        console.log(newText, currentText);
        this.setState({
          displayMainText: key.text,
          displayFormulaText: newText,
        });
      }
    }

    if (key.type == "clear") {
      this.setState({
        displayMainText: "0",
        displayFormulaText: "",
      });
    }

    if (key.type == "equals") {
      let text = "";
      let formula = "";
      let result = 0;

      text = this.state.displayMainText;
      formula = this.state.displayFormulaText;

      if (!isNaN(this.state.displayMainText)) {
        text = (
          Math.round(
            (eval(formula + this.state.displayMainText) + Number.EPSILON) *
              10000
          ) / 10000
        ).toString();
        console.log("formula: " + formula);
        formula = "";
        console.log("Result: " + text);
      } else {
        text = (
          Math.round((eval(formula) + Number.EPSILON) * 10000) / 10000
        ).toString();
        console.log("formula: " + formula);
        formula = "";
        console.log("Result: " + text);
      }

      this.setState({
        displayMainText: text,
        displayFormulaText: formula,
      });
    }
  }

  render() {
    let buttons = keys.map((key) => (
      <Button keyData={key} handleClick={this.handleClick} />
    ));
    console.log("here");
    return (
      <div id="calculator">
        <Display
          mainText={this.state.displayMainText}
          formulaText={
            "= " + this.state.displayFormulaText + this.state.displayMainText
          }
        />
        {buttons}
      </div>
    );
  }
}

//render calculator
ReactDOM.render(<Calculator />, document.getElementById("app"));
