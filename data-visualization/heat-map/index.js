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

    let monthsDates = [
      new Date(Date.UTC(1970, 12, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 1, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 2, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 3, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 4, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 5, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 6, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 7, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 8, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 9, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 10, 3, 5, 5, 5)),
      new Date(Date.UTC(1970, 11, 3, 5, 5, 5)),
    ];
    /*for (let i = 1; i < 13; ++i) {
      monthsDates.push(new Date(Date.UTC(1970, i, 3, 5, 5, 5)));
    }*/

    console.log(monthsDates);

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

    console.log(dataset);
  }
);
