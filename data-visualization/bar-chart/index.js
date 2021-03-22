/*
 *  Author: Samuele Girgenti
 *  Date: 22 / 03 / 2021
 */

let width = 700;
let height = 350;
let padding = 50;

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  (data) => {
    dataset = data.data;
    console.log(dataset);
    const colPadding = 0;
    const colWidth = (width - padding * 2) / dataset.length - colPadding;

    const heightScale = d3
      .scaleLinear()
      .domain([d3.max(dataset, (d) => d[1]), 0])
      .range([padding, height - padding]);

    var years = data.data.map(function (item) {
      return new Date(item[0]);
    });

    var xAxisScale = d3
      .scaleTime()
      .domain([d3.min(years), d3.max(years)])
      .range([padding, width - padding]);
    console.log(heightScale);

    const title = d3
      .select(".graph")
      .append("h1")
      .text(data.name)
      .attr("id", "title")
      .style("text-align", "center");

    const tooltip = d3
      .select(".graph")
      .append("div")
      .attr("id", "tooltip")
      .style("background-color", "rgb(153, 153, 255)")
      .style("border-radius", "3px")
      .style("box-shadow", "3px 2px 2px black")
      .style("width", "70px")
      .style("height", "30px")
      .style("opacity", "0")
      .style("position", "absolute")
      .style("font-size", "8px")
      .style("text-align", "center");

    const svg = d3
      .select(".graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("width", colWidth)
      .attr("height", (d) => {
        return height - heightScale(d[1]) - padding;
      })
      .attr("y", (d) => {
        return heightScale(d[1]);
      })
      .attr("x", (d, i) => {
        return padding + i * (colWidth + colPadding);
      })
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("class", "bar")
      .on("mouseover", (d, i) => {
        tooltip
          .style("top", `${height}px`)
          .style("left", `${i * colWidth + padding}px`)
          .style("opacity", "100")
          .attr("data-date", d[0])
          .html(`<p>Date: ${d[0]}</p><p>GDP: ${d[1]}</p>`);
      })
      .on("mouseout", (d, i) => {
        tooltip.style("opacity", "0");
      });

    const xAxis = d3.axisBottom(xAxisScale);

    const yAxis = d3.axisLeft(heightScale);

    svg
      .append("g")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis)
      .attr("id", "x-axis");
    svg
      .append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis)
      .attr("id", "y-axis");
  }
);
