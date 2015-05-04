d3.csv("pre_assessment.csv", function(data) {
  data.forEach(function(d) {
    console.log(d);
  });
  var parsedData = d3.csv.parseRows(data);
  console.log(parsedData);
});
