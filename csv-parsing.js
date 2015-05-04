function parseCSV(csvPath) {
  if (csvPath.match(/\.csv$/)) {
    d3.csv(csvPath, function(data) {
      var keys = Object.keys(data[0]);
      var container = $('parameters');
      var inputs = container.find('input');
      inputs.forEach(function(input) {
        container.removeChild(input);
      });
      keys.forEach(function(k) {
        $('<input />', { type: 'checkbox', id: 'cb' + id, value: k }).appendTo(container);
        $('<label />', { 'for': 'cb' + id, text: k }).appendTo(container);
      });
      data.forEach(function(d) {
        console.log(d);
      });
    });
  }
}
