pieParams = ["Country", "City", "Region", "Postal", "State", "Grade", "Gender", "Ethnicity"];
barParamsPre = ["I make an effort to get along with my teammates.",
             "I am confident speaking in front of others.",
             "I think about the advantages and disadvantages of a choice before making a decision.",
             "Score (Average: 42.21)"];
barParamsPost = ["I make an effort to get along with my teammates.",
             "I am confident speaking in front of others.",
             "I think about the advantages and disadvantages of a choice before making a decision.",
             "Score (Average: 64.49)"];

function loadVisual() {
  d3.csv("pre_assessment.csv", function(rawData) {
    pieParams.forEach(function(p) {
      createPie(p, "left", extractData(rawData, p).sort(compareLabel));
    });
    barParamsPre.forEach(function(p) {
      createBar(p, "left", extractData(rawData, p).sort(compareLabelInt));
    });
  });
  d3.csv("post_assessment.csv", function(rawData) {
    pieParams.forEach(function(p) {
      createPie(p, "right", extractData(rawData, p).sort(compareLabel));
    });
    barParamsPost.forEach(function(p) {
      createBar(p, "right", extractData(rawData, p).sort(compareLabelInt));
    });
  });
}


function compareLabelInt(a, b) {
  if (parseInt(a.label) < parseInt(b.label)) {
    return -1;
  } else if (parseInt(a.label) > parseInt(b.label)) {
    return 1;
  } else {
    return 0;
  }
}

function compareLabel(a, b) {
  if (a.label < b.label) {
    return -1;
  } else if (a.label > b.label) {
    return 1;
  } else {
    return 0;
  }
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
  return counts;
}

function createBar(title, side, data) {
  var margin = { top: 100, right: 20, bottom: 40, left: 60 };
  var w = $(window).width() / 2 - margin.right - margin.left,
      h = w - margin.top - margin.bottom,
      color = d3.scale.category20c();
  var x = d3.scale.ordinal()
            .rangeRoundBands([0, w], .1);
  var y = d3.scale.linear()
            .rangeRound([h, 0]);
  var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
  var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(d3.format(".2s"));
  var svg = d3.select("#" + side + "-visual").append("svg")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom)
              .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(data.map(function(d) { return d.label; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("text").attr("x", w / 2).attr("y", - margin.top / 2).attr("text-anchor", "middle")
                    .style("text-decoration", "underline").style("font-size", "16px").text(title);
  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + h + ")").call(xAxis);
  svg.append("g").attr("class", "y axis").call(yAxis);

  svg.selectAll(".bar").data(data).enter().append("rect")
      .attr("class", "bar").attr("fill", function(d, i) { return color(i); })
      .attr("x", function(d) { return x(d.label); }).attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); }).attr("height", function(d) { return h - y(d.value); });

}

/* Code taken from https://gist.github.com/enjalot/1203641
 * Has some slight modifications to the ratios and removed legend */
function createPie(title, side, data) {
  var w = $(window).width() / 2, h = w, r = w / 3, inner = r / 3, color = d3.scale.category20c();
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
