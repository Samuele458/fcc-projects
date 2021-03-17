class Editor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="editor-box">
        <textarea id="editor"></textarea>
      </div>
    );
  }
}

class Previewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="preview">
        <p>previewer</p>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="app-box">
        <Editor />
        <Previewer />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
