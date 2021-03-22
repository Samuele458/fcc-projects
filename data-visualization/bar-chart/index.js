let width = 600;
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
      .style("fill", "red")
      .attr("width", colWidth)
      .attr("height", (d) => {
        return height - heightScale(d[1]) - padding;
      })
      .attr("y", (d) => {
        return heightScale(d[1]);
      })
      .attr("x", (d, i) => {
        return padding + i * (colWidth + colPadding);
      });
    const xAxis = d3.axisBottom(xAxisScale);

    const yAxis = d3.axisLeft(heightScale);

    svg
      .append("g")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
  }
);
