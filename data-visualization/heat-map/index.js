const width = 1300;
const height = 550;
const padding = 70;

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
      .style("fill", "red")
      .attr("x", (d, i) => {
        return padding + Math.floor(i / 12) * elementWidth;
      })

      .attr("y", (d, i) => {
        console.log(dataset[dataset.length - 1].year - dataset[0].year);
        return padding + (i % 12) * elementHeight;
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
      .call(yAxis);
  }
);
