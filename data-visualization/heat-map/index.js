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
      return d;
    });

    const elementWidth =
      (width - padding * 2) /
      (dataset[dataset.length - 1].year - dataset[0].year);
    const elementHeight = (height - padding * 2) / 12;

    console.log(dataset[dataset.length - 1].year - dataset[0].year);

    d3.select(".graph").append("h1").text("Title").attr("id", "title");
    d3.select(".graph").append("h2").text("subtitle").attr("id", "description");

    let xScale = d3
      .scaleLinear()
      .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
      .range([padding, width - padding / 2]);

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
    console.log(colorScale("0.8"));
    console.log([
      d3.min(dataset, (d) => d.temperature),
      d3.max(dataset, (d) => d.temperature),
    ]);

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
      .style("fill", (d, i) => {
        return colorScale(d.temperature);
      });

    const xAxis = d3.axisBottom(xScale).ticks(20).tickFormat(d3.format("1000"));
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
      .call(legendAxis)
      .attr("id", "x-axis");

    legend.append("rect").attr("width");
  }
);
