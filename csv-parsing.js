parseCSV = function(csvPath) {
  d3.csv(csvPath, function(data) {
    var keys = Object.keys(data[0]);
    keys.forEach(function(k) {
      console.log(k);
    });
    data.forEach(function(d) {
      console.log(d);
    });
  });
};

