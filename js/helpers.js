//Calculations

var sumList = function(data) {
  return _.reduce(data, function(memo, element) {
    return memo + element;
  }, 0);
};

var reduceByField = function(data, field, name) {

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

            yValue = sumList(yValueArray);

        point.x = xValue;
        point.y = yValue;

        pointArray.push(point);
    }

    var result = {};
    result.values = pointArray;
    result.key = name

    return result
};

var divide = function(data, normalizeWith) {
    console.log('normaliziing')
    var numerators = [];
    var result = [];
    var denominator = {};

    data.forEach(function(metric) {
        if(metric.key == normalizeWith)
            denominator = metric
        else 
            numerators.push(metric)
    });

    numerators.forEach(function(numerator) {      
        var values = numerator.values
        var newValues = _.map(values, function(value) {
            var xValue = value.x
            var yValue = value.y
            console.log(denominator.values, xValue);
            var divisor = _.find(denominator.values, function(dvalue)         {return dvalue.x == xValue })
                        
     
            return {x:xValue, y: yValue / divisor.y}
        })
        
        result.push({key: numerator.key, values:newValues});
        
    })
    return result

};


//Graphs

var setGraphAxis = function(data, chart) {
    console.log(data);
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

