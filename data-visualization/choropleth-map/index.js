const width = 1300;
const height = 700;
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

  const title = d3.select(".graph").append("h1").text("USA map");

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
    .attr("fill", "blue")
    .attr("d", path);
}
