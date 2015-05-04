d3.csv("pre_assessment.csv", function(data) {
    var parsedData = d3.csv.parseRows(data);
    for (i = 0; i < parsedData.length; i++) {
      console.log("hi");
      console.log(parsedData[i]);
    }
});
