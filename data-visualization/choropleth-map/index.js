/*
 *  Author: Samuele Girgenti
 *  Date: 24 / 03 / 2021
 */

const width = 960;
const height = 600;
const padding = 70;

d3.queue()
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
  )
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
  )
  .await(ready);

function ready(error, educational_data, us_data) {
  if (error) throw error;
  else console.log("data downloaded");

  let path = d3.geoPath();

  const colorScale = d3
    .scaleLinear()
    .domain([
      d3.min(educational_data, (d) => d.bachelorsOrHigher),
      d3.max(educational_data, (d) => d.bachelorsOrHigher),
    ])
    .range(["white", "red"]);

  const title = d3
    .select(".graph")
    .append("h1")
    .text("US Educational Attainment")
    .attr("id", "title");

  const description = d3
    .select(".graph")
    .append("h3")
    .text("Percentage of adults with a bachelor's degree or higher")
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

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(us_data, us_data.objects.counties).features)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("fill", (d) => {
      return colorScale(
        educational_data.filter((elem) => {
          return elem.fips == d.id;
        })[0].bachelorsOrHigher
      );
    })
    .attr("d", path)
    .attr("data-fips", (d) => {
      return d.id;
    })
    .attr("data-education", (d) => {
      return educational_data.filter((elem) => {
        return elem.fips == d.id;
      })[0].bachelorsOrHigher;
    })
    .on("mouseover", (d, i) => {
      let county = educational_data.filter((elem) => {
        return elem.fips == d.id;
      })[0];

      tooltip
        .style("top", `${d3.event.pageY + 10}px`)
        .style("left", `${d3.event.pageX + 10}px`)
        .style("opacity", "100")
        .attr("data-education", county.bachelorsOrHigher)
        .html(
          `<p>${county.area_name}, ${county.state}: ${county.bachelorsOrHigher}</p>`
        );
    })
    .on("mouseout", (d, i) => {
      tooltip.style("opacity", "0");
    });

  const minValue = d3.min(educational_data, (d) => d.bachelorsOrHigher);
  const maxValue = d3.max(educational_data, (d) => d.bachelorsOrHigher);

  console.log(minValue, maxValue);

  let legendValues = [
    minValue,
    minValue + (maxValue - minValue) / 4,
    minValue + (maxValue - minValue) / 2,
    minValue + ((maxValue - minValue) / 4) * 3,
    maxValue,
  ];

  legendValues = legendValues.map((val) => {
    return Math.floor(val);
  });

  const legendScale = d3.scalePoint().domain(legendValues).range([0, 200]);

  const legendAxis = d3.axisBottom(legendScale);

  const legend = svg.append("g").attr("id", "legend");

  legend
    .append("g")
    .attr("transform", "translate(500," + (height - 25) + ")")
    .call(legendAxis);

  legend
    .selectAll("rect")
    .data(legendValues)
    .enter()
    .append("rect")
    .attr("x", (d, i) => {
      return 500.5 + i * 40;
    })
    .attr("y", height - 50)
    .attr("width", 40)
    .attr("height", 25)
    .attr("fill", (d, i) => {
      return colorScale(d);
    })
    .attr("class", "legend-rect");

  console.log(legendValues);
}
