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

    let xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Year), d3.max(data, (d) => d.Year)])
      .range([padding, width - padding / 2]);

    let yScale = d3
      .scaleTime()
      .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
      .range([padding, height - padding]);

    const svg = d3
      .select(".graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

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
  }
);
