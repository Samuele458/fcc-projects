/*
 *  Author: Samuele Girgenti
 *  Date: 25 / 03 / 2021
 */

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

const width = 800 + margin.left + margin.right;
const height = 600 + margin.top + margin.bottom;

const title = d3
  .select(".graph")
  .append("h1")
  .text("Top 100 Most Sold Videogames")
  .attr("id", "title");

const description = d3
  .select(".graph")
  .append("h3")
  .text("Top 100 Most Sold Videogames, platform-by-platform")
  .attr("id", "description");

const tooltip = d3
  .select(".graph")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", "0");

const svg = d3
  .select(".graph")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  (data) => {
    
    let root = d3.hierarchy(data).sum((d) => {
      return d.value;
    });

    d3
      .treemap()
      .size([
        width - margin.right - margin.left,
        height - margin.top - margin.bottom,
      ])
      .paddingInner(1)(root);

    const fader = (color) => {
      return d3.interpolateRgb(color, "#fff")(0.3);
    };
    const color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

    
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
      .attr("fill", (d) => color(d.data.category))
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .on("mouseover", (d, i) => {
        tooltip
          .style("top", `${d3.event.pageY + 10}px`)
          .style("left", `${d3.event.pageX + 10}px`)
          .style("opacity", "100")
          .attr("data-value", d.data.value)
          .html(
            `<p>Name: ${d.data.name}</p><p>Category: ${d.data.category}</p><p>Value: ${d.data.value}</p>`
          );
      })
      .on("mouseout", (d, i) => {
        tooltip.style("opacity", "0");
      });

    svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("class", "tile-text")
      .attr("x", (d) => d.x0 + margin.left)
      .attr("y", (d) => d.y0 + margin.top)
      .selectAll("tspan")
      .data((d) =>
        d.data.name.split(/\s|\//gi).map((elem) => {
          return {
            text: elem,
            x: d.x0,
            y: d.y0,
          };
        })
      )
      .enter()
      .append("tspan")
      .attr("x", (d) => d.x + margin.left + 3)
      .attr("y", (d, i) => d.y + margin.top + 10 + i * 7)
      .text((d) => d.text);

    const legendSvg = d3
      .select(".graph")
      .append("svg")
      .attr("id", "legend")
      .attr("width", width / 1.3)
      .attr("height", height);

    legendSvg
      .selectAll("rect")
      .data(data.children)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("height", 25)
      .attr("width", 25)
      .attr("x", (d, i) => margin.left + (i % 4) * 150)
      .attr("y", (d, i) => margin.top + Math.floor(i / 4) * 50)
      .attr("fill", (d) => color(d.name));

    legendSvg
      .selectAll("text")
      .data(data.children)
      .enter()
      .append("text")
      .attr("x", (d, i) => margin.left + (i % 4) * 150 + 35)
      .attr("y", (d, i) => margin.top + Math.floor(i / 4) * 50 + 17)
      .text((d) => d.name);
  }
);
