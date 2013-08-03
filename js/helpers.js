var sumList = function(data) {
  return _.reduce(data, function(memo, element) {
    return memo + element;
  }, 0);
};

var reduceByField = function(data, field, calculation) {
    var grouped = _.groupBy(data, function(item) {
        return item["key"][field];});
    var reducedToValues = [];
    for (key in grouped) {
        var valueArray = [];
        _.each(grouped[key], function(item) {
            console.log(item["val"]);
            valueArray.push(item["val"]);});
        if (calculation == "sum")
            var value = sumList(valueArray);
        var obj = {};
        obj[key] = value;
        reducedToValues.push(obj);
    }

    return reducedToValues
};

http://jsfiddle.net/85FZZ/