d3.csv("pre_assessment.csv", function(data) {
  for (i = 0; i < data.length; i++) {
    console.log(data[i]);
  }
  var parsedData = d3.csv.parseRows(data);
  console.log(parsedData);
});
