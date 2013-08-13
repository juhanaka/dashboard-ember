//Models

//FILTER MODELS

var defaultFilters = ['dates'];

//set Filter class. The Filter object will be multiplied for each filter.
App.Filter = Ember.Object.extend({
	//capitalize first letter to get title
	filterTitle: function() {
		return this.get('id').charAt(0).toUpperCase() + this.get('id').slice(1);
	}.property('id'),

	//set attribute to see if filter is loaded
	loadedFilter: false,

	//create method to load filter values from server
	loadValues: function() {
		var filter = this;
		return Ember.Deferred.promise(function (p) {  
			if (filter.get('loadedFilter')) { 
				p.resolve(filter.get('values'));
			} else {
				p.resolve($.getJSON("http://127.0.0.1:13373/options/" + filter.get('id')).then(function(response) {
				var values = Ember.A();
				response[filter.get('id')].forEach(function(value) {
					values.push(value);
				});
				filter.setProperties({"values": values, "loadedFilter": true});
				return values;
				}))
			}})}
	}  
);



//reopen class to create "all" method which returns all instances of Filter class
App.Filter.reopenClass({
	all: function() {
		if (this._all) {return this._all; }
		var all = Ember.A();
		defaultFilters.forEach(function(id) {
			var filter = App.Filter.create({id: id});
			filter.loadValues();
			all.pushObject(filter);
		});
		this._all = all;
		return all;
}});

//reopen Filter to set an observer that notifies when filter is changed
App.Filter.reopen({
	filterChanged: Ember.observer(function() {
	console.log("filter changed");
}, 'this.values.@each.selected')
});

App.Filters = App.Filter.all();


//METRICS MODELS

var defaultMetricsSettings = [
{"id":"dau", "calcMetric":false, "view" : "Dashboard", "visible": true, "calculation" : "sum", "format" : "bar", "width" : "48%", "groupFields": [{"name":"date", "isActive":true}, {"name":"device", "isActive":false}]}, 
{"id":"dnu", "calcMetric":false, "view" : "Dashboard", "displayWith": "dnu", "visible": true, "calculation" : "sum", "format" : "bar", "width" : "48%", "groupFields": [{"name":"date", "isActive":true}, {"name":"device", "isActive":false}]}, 
{"id":"revenue", "calcMetric":false, "view" : "Economy", "visible": true, "calculation" : "sum", "format" : "bar", "width" : "48%", "groupFields": [{"name":"date", "isActive":true}, {"name":"device", "isActive":false}]},
{"id":"revenuePerPlayer","calcMetric":true, "view" : "Economy", "visible": true, "calculation" : "divide", "numerator":"revenue", "denominator":"dau", "format" : "bar", "width" : "48%", "groupFields": [{"name":"date", "isActive":true}, {"name":"device", "isActive":false}]},
];

App.Metric = Ember.Object.extend({

	metricTitle: function() {
		return this.get('id').charAt(0).toUpperCase() + this.get('id').slice(1);
	}.property('id'),

	loadedMetric: false,

	filtersBinding: 'App.Filters',

	loadValues: function() {
	var metric = this;
	var filters = metric.get('filters');
	if (!this.get('calcMetric')) {  
		return Ember.Deferred.promise(function (p) {  
			if (metric.get('loadedMetric')) { 
				p.resolve(metric.get('values'));

			} else {
				p.resolve(
				console.log('sending ajax'),
				$.ajax({ 
				url: "http://127.0.0.1:13373/" + metric.get('id') + "/",
				data: JSON.stringify(metric.get('filters')),
				}).then(function(response) {
				var values = Ember.A();
				response[metric.get('id')].forEach(function(value) {
					values.push(value);
				});
				metric.setProperties({"values": values, "loadedMetric": true});
				return values;
				}))
			}})}
	else {
		metric.setProperties({"loadedMetric": true})
	}
	}


});

App.Metric.reopenClass({
	findByView: function(searchView) {
		if (this._findByView) {return this._findByView; }
		var metrics = Ember.A();
		defaultMetricsSettings.forEach(function(metric) {
			if (metric.view == searchView)
				metrics.pushObject(App.Metric.create({id: metric.id},{view: metric.view}, {calcMetric: metric.calcMetric}, {visible: metric.visible}, {calculation: metric.calculation}, {divideBy: metric.divideBy}, {format: metric.format}, {width: metric.width}, {groupFields: metric.groupFields}));
		});
		this._metrics = metrics;
		return metrics;
	}
});