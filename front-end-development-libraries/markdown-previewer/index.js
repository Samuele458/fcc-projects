/*
 *    Author:       Samuele Girgenti
 *    Date:         17 / 03 / 2021
 */

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

marked.setOptions({
  breaks: true,
});

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

const preview_md = `# Visual Dijkstra
## Simple visual graph editor, with built-in step-by-step Dijkstra's algorithm


> **Visual Dijkstra** is a free and open-source tool, designed for creating and manipulating graphs. It allows you to find the shortest path between two nodes, by applying **Dijkstra's Shortest Path First algorithm**. 

![Visual Dijkstra Screenshot](https://raw.githubusercontent.com/Samuele458/visual-dijkstra/main/img/screen-001.png)
![Visual Dijkstra Screenshot](https://raw.githubusercontent.com/Samuele458/visual-dijkstra/main/img/screen-002.png)

## Features

- Graph editor
- Dijkstra algorithm
- Step-by-step resolution


## Run on linux
On linux, download the appimage, then:
\`\`\`
 $ chmod +x Visual-Dijkstra-v1.0-x64.Linux.AppImage
 $ ./Visual-Dijkstra-v1.0-x64.Linux.AppImage
\`\`\`

### Technologies used
 - \`C++\`
 - \`Qt Widgets 5.15.2\`

## Download

Click [here](https://github.com/Samuele458/visual-dijkstra/releases) to get the latest release.

`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mdSource: preview_md,
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
