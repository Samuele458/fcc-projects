/*
 *  Author: Samuele Girgenti
 *  Date: 24 / 03 / 2021
 */

const width = 1300;
const height = 550;
const padding = 70;

colors = [
  {
    color: "blue",
    temp: 0,
  },
  {
    color: "white",
    temp: 5,
  },
  {
    color: "yellow",
    temp: 10,
  },
  {
    color: "red",
    temp: 15,
  },
];

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  (data) => {
    let temp = data.baseTemperature;
    const dataset = data.monthlyVariance.map((d) => {
      d.temperature = Math.round((temp + d.variance) * 10) / 10;
      d.yearDate = new Date(Date.UTC(d.year, 0, 1, 0, 0, 0));

      return d;
    });

    const elementWidth =
      (width - padding * 2) /
      (dataset[dataset.length - 1].year - dataset[0].year);
    const elementHeight = (height - padding * 2) / 12;

    d3.select(".graph")
      .append("h1")
      .text("Global temperature")
      .attr("id", "title");
    d3.select(".graph")
      .append("h2")
      .text("Global temperature month-by-month, from 1753 to 2015")
      .attr("id", "description");

    /*
    let xScale = d3
      .scaleLinear()
      .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
      .range([padding, width - padding]);
*/
    let xScale = d3
      .scaleTime()
      .domain([
        d3.min(dataset, (d) => d.yearDate),
        d3.max(dataset, (d) => d.yearDate),
      ])
      .range([padding, width - padding]);
    let yScale = d3
      .scaleBand()
      .domain([
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ])
      .range([padding, height - padding]);

    const colorScale = d3
      .scaleLinear()
      .domain([colors[0].temp, colors[1].temp, colors[2].temp, colors[3].temp])
      .range([
        colors[0].color,
        colors[1].color,
        colors[2].color,
        colors[3].color,
      ]);
    

    const tooltip = d3
      .select(".graph")
      .append("div")
      .attr("id", "tooltip")
      .style("background-color", "rgb(153, 153, 255)")
      .style("border-radius", "3px")
      .style("box-shadow", "3px 2px 2px black")
      .style("width", "120px")
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
      .attr("width", elementWidth)
      .attr("height", elementHeight)
      .attr("x", (d, i) => {
        return padding + Math.floor(i / 12) * elementWidth;
      })
      .attr("y", (d, i) => {
        return padding + (i % 12) * elementHeight;
      })
      .attr("class", "cell")
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => d.temperature)
      .style("fill", (d, i) => {
        return colorScale(d.temperature);
      })
      .on("mouseover", (d, i) => {
        tooltip
          .style("top", `${padding * 2 + (i % 12) * elementHeight}px`)
          .style("left", `${padding + Math.floor(i / 12) * elementWidth}px`)
          .style("opacity", "100")
          .attr("data-year", d.year)
          .html(
            `<p>Year: ${d.year}</p><p>Month: ${
              d.month - 1
            }</p><p>Temperature: ${d.temperature}</p>`
          );
      })
      .on("mouseout", (d, i) => {
        tooltip.style("opacity", "0");
      });

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis)
      .attr("id", "x-axis");

    svg
      .append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis)
      .attr("id", "y-axis");

    const legendScale = d3
      .scaleBand()
      .domain([colors[0].temp, colors[1].temp, colors[2].temp, colors[3].temp])
      .range([padding, width / 7]);

    const legendAxis = d3.axisBottom(legendScale);

    const legend = svg.append("g").attr("id", "legend");

    legend
      .append("g")
      .attr("transform", "translate(0," + (height - padding / 2.4) + ")")
      .call(legendAxis);

    legend
      .append("rect")
      .attr("width", (width / 7 - padding) / 4)
      .attr("height", 20)
      .attr(
        "transform",
        "translate(" + padding + "," + (height - padding / 2.4 - 20) + ")"
      )
      .attr("fill", "blue");
    
    legend
      .append("rect")
      .attr("width", (width / 7 - padding) / 4)
      .attr("height", 20)
      .attr(
        "transform",
        "translate(" +
          (padding + ((width / 7 - padding) / 4) * 1) +
          "," +
          (height - padding / 2.4 - 20) +
          ")"
      )
      .attr("fill", "white");
    legend
      .append("rect")
      .attr("width", (width / 7 - padding) / 4)
      .attr("height", 20)
      .attr(
        "transform",
        "translate(" +
          (padding + ((width / 7 - padding) / 4) * 2) +
          "," +
          (height - padding / 2.4 - 20) +
          ")"
      )
      .attr("fill", "yellow");
    legend
      .append("rect")
      .attr("width", (width / 7 - padding) / 4)
      .attr("height", 20)
      .attr(
        "transform",
        "translate(" +
          (padding + ((width / 7 - padding) / 4) * 3) +
          "," +
          (height - padding / 2.4 - 20) +
          ")"
      )
      .attr("fill", "red");
  }
);
