//Clock component class
class Clock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="clock">
        <p>test</p>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("app"));
