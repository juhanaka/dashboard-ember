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
            var divisor = _.find(denominator.values, function(dvalue)         {return dvalue.x == xValue })
                        
     
            return {x:xValue, y: yValue / divisor.y}
        })
        
        result.push({key: numerator.key, values:newValues});
        
    })
    return result

};


//Graphs

var setGraphxAxis = function(data, chart) {
    try { 
        var type = new Date(data[0]['values'][0]['x']);

    if (type.getMonth()) {  
        chart.xAxis
            .tickFormat(function(d) {
                return d3.time.format('%x')(new Date(d));
            })
            .rotateLabels(70)
            //.scale(x)
            //.ticks(graph.items.length + 1) 
        }
    }
    catch(err) {
        var type = null;
    }

    return chart
};

var setGraphyAxis = function(data, chart, display) {
    if(display == 'percentage') {  
        chart.yAxis
                .tickFormat(d3.format(',.1%'));
        }

    return chart
}


//Handlebars
Ember.Handlebars.helper('formatDate', function(date) {
    return d3.time.format('%x')(new Date(date))
})

