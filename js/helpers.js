//Calculations

var sumList = function(data) {
  return _.reduce(data, function(memo, element) {
    return memo + element;
  }, 0);
};

var reduceByField = function(data, field, calculation, name) {
    var grouped = _.groupBy(data, function(item) {
        return item["key"][field];});

    var pointArray = [];
    for (var key in grouped) {
        var yValueArray = [];
        var point = {};
        var yValue = 0;
        var xValue = key;

        _.each(grouped[key], function(item) {
            yValueArray.push(item["val"]);});

        if (calculation == "sum")
            yValue = sumList(yValueArray);

        point.x = xValue;
        point.y = yValue;

        pointArray.push(point);
    }

    var result = {};
    result.values = pointArray;
    result.key = name

    var resultArray = [];
    resultArray.push(result);
    return resultArray
};

var setGraphAxis = function(data, chart) {
    var type = new Date(data[0]['values'][0]['x'])

    if (type.getMonth()) {  
        chart.xAxis
            .tickFormat(function(d) {
                return d3.time.format('%x')(new Date(d));
            })
            .rotateLabels(70)
            //.scale(x)
            //.ticks(graph.items.length + 1) 
        }

    return chart


}