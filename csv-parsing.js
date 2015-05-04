d3.csv("pre_assessment.csv", function(data) {
  var keys = Object.keys(data[0]);
  keys.forEach(function(k) {
    console.log(k);
  });
  data.forEach(function(d) {
    console.log(d);
  });
});
