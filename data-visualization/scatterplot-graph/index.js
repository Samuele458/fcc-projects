/*
 *  Author: Samuele Girgenti
 *  Date: 23 / 03 / 2021
 */

let width = 700;
let height = 350;
let padding = 50;

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  (dataset) => {
    let data = dataset.map((d) => {
      var parsedTime = d.Time.split(":");
      d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
      return d;
    });

    const itaColor = "rgb(51, 204, 51)";
    const othersColor = "rgb(255, 209, 26)";

    let xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.Year) - 1,
        d3.max(data, (d) => d.Year) + 1,
      ])
      .range([padding, width - padding / 2]);

    let yScale = d3
      .scaleTime()
      .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
      .range([padding, height - padding]);

    const title = d3
      .select(".graph")
      .append("h1")
      .text("Data on cyclists doping")
      .style("text-align", "center")
      .attr("id", "title");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", "0.1");

    const svg = d3
      .select(".graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time)
      .attr("fill", (d) => {
        if (d.Nationality === "ITA") return itaColor;
        return othersColor;
      })
      .on("mouseover", (d) => {
        tooltip
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .style("opacity", 1)
          .attr("data-year", d.Year)
          .html(
            `<p>Name: ${d.Name}</p><p>Time: ${d.Time}</p><p>Year: ${d.Year}</p>`
          );
      })
      .on("mouseout", (d) => {
        tooltip.style("opacity", 0);
      });

    const xAxis = d3.axisBottom(xScale).ticks(13).tickFormat(d3.format("1000"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

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

    let legend = svg.append("g").attr("id", "legend");

    legend
      .attr("width", "100")
      .attr("height", "50")
      .attr("y", "0")
      .attr("x", width - padding)
      .attr("transform", "translate(0,250)");

    legend
      .append("text")
      .text("Italians")
      .attr("y", "-100")
      .attr("x", width - padding * 2);

    legend
      .append("rect")
      .attr("y", "-112")
      .attr("x", width - padding / 1.8)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", itaColor);

    legend
      .append("text")
      .text("Others")
      .attr("y", "-70")
      .attr("x", width - padding * 2);

    legend
      .append("rect")
      .attr("y", "-82")
      .attr("x", width - padding / 1.8)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", othersColor);
  }
);
