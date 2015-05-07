function loadVisual() {
  d3.csv("pre_assessment.csv", function(rawData) {
    createGraph("City", "left", extractData(rawData, "City"));
  });
  d3.csv("post_assessment.csv", function(rawData) {
    createGraph("City", "right", extractData(rawData, "City"));
  });
}

function extractData(data, parameter) {
  var indices = {}, counts = [];
  data.forEach(function(d) {
    var val = d[parameter];
    if (val != "") {
      if (typeof indices[val] == "undefined") {
        indices[val] = counts.length;
        counts.push({"label": val, "value": 0});
      }
      counts[indices[val]].value += 1;
    }
  });
  return counts.sort(function(a, b) {
  if (a.label < b.label) {
    return -1;
  } else if (a.label > b.label) {
    return 1;
  } else {
    return 0;
  }
});
}

/* Code taken from https://gist.github.com/enjalot/1203641
 * Has some slight modifications to the ratios and removed legend */
function createGraph(title, side, data) {
  var w = $(window).width() / 3, h = w, r = w / 3, inner = r / 3, color = d3.scale.category20c();
  var total = d3.sum(data, function(d) {
      return d3.sum(d3.values(d));
  });

  var vis = d3.select("#" + side + "-visual")
      .append("svg:svg")
      .data([data])
          .attr("width", w)
          .attr("height", h)
      .append("svg:g")
          .attr("transform", "translate(" + w / 2 + "," + w / 2 + ")")

  var textTop = vis.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .attr("class", "textTop")
      .text(title)
      .attr("y", -10),
  textBottom = vis.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .attr("class", "textBottom")
      .text("Total: " + total.toFixed(2))
      .attr("y", 10);

  var arc = d3.svg.arc()
      .innerRadius(inner)
      .outerRadius(r);

  var arcOver = d3.svg.arc()
      .innerRadius(inner + 5)
      .outerRadius(r + 5);
   
  var pie = d3.layout.pie()
      .value(function(d) { return d.value; });
   
  var arcs = vis.selectAll("g.slice")
      .data(pie)
      .enter()
          .append("svg:g")
              .attr("class", "slice")
              .on("mouseover", function(d) {
                  d3.select(this).select("path").transition()
                      .duration(200)
                      .attr("d", arcOver)
                  
                  textTop.text(d3.select(this).datum().data.label)
                      .attr("y", -10);
                  textBottom.text(d3.select(this).datum().data.value.toFixed(2))
                      .attr("y", 10);
              })
              .on("mouseout", function(d) {
                  d3.select(this).select("path").transition()
                      .duration(100)
                      .attr("d", arc);
                  
                  textTop.text(title)
                      .attr("y", -10);
                  textBottom.text("Total: " + total.toFixed(2));
              });

  arcs.append("svg:path")
      .attr("fill", function(d, i) { return color(i); } )
      .attr("d", arc);
}

loadVisual();
