const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

const width = 600 + margin.left + margin.right;
const height = 500 + margin.top + margin.bottom;

const svg = d3
  .select(".graph")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  (data) => {
    console.log(data);
    let root = d3.hierarchy(data).sum((d) => {
      return d.value;
    });

    d3
      .treemap()
      .size([
        width - margin.right - margin.left,
        height - margin.top - margin.bottom,
      ])(root);

    svg
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0 + margin.left)
      .attr("y", (d) => d.y0 + margin.top)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("class", "tile")
      .attr("fill", "orange")
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value);

    svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("class", "tile-text")
      .attr("x", (d) => d.x0 + margin.left + 10)
      .attr("y", (d) => d.y0 + margin.top + 10)
      //.text("ciao ehehheh  come stai eh")
      .selectAll("tspan")
      .data((d) =>
        d.data.name.split(" ").map((elem) => {
          return {
            text: elem,
            x: d.x0,
            y: d.y0,
          };
        })
      )
      .enter()
      .append("tspan")
      .attr("x", (d) => 4)
      .attr("y", (d, i) => d.y0 + margin.top + 10 + i * 100)
      .text((d) => d);
  }
);
