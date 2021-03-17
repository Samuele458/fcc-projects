class Editor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <div id="editor-box">
        <textarea
          id="editor"
          value={this.props.md}
          onChange={this.props.onChange}
        ></textarea>
      </div>
    );
  }
}

const renderer = new marked.Renderer();

class Previewer extends React.Component {
  constructor(props) {
    super(props);

    this.mdToHtml = this.mdToHtml.bind(this);
  }

  mdToHtml(mdSource) {
    return { __html: marked(mdSource, { renderer: renderer }) };
  }

  render() {
    return (
      <div
        id="preview"
        dangerouslySetInnerHTML={this.mdToHtml(this.props.md)}
      ></div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mdSource: "test",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({
      mdSource: event.target.value,
    });
  }

  render() {
    return (
      <div id="app-box">
        <Editor md={this.state.mdSource} onChange={this.handleChange} />
        <Previewer md={this.state.mdSource} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
