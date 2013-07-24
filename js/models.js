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
/*App.Filter.reopenClass({
	all: function() {
		if (this._all) {return this._all; }
		var all = Ember.A();
		defaultFilters.forEach(function(id) {
			all.pushObject(App.Filter.create({id: id}));
		});
		this._all = all;
		return all;
}});*/

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

var defaultMetrics = ['dau', 'dnu', 'daily_revenue']

var defaultMetricsSettings = [
{"id":"dau", "view" : "Dashboard", "calculation" : "sum", "format" : "bar", "width" : "48%"}, 
{"id":"dnu", "view" : "Dashboard", "calculation" : "sum", "format" : "bar", "width" : "48%"}
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
				console.log('loaded metrics');
			});
			metric.setProperties({"values": values, "loadedMetric": true});
			return values;
			}))
		}})}


});

App.Metric.reopenClass({


	findByView: function(searchView) {
		if (this._metrics) {return this._metrics; }
		var metrics = Ember.A();
		defaultMetricsSettings.forEach(function(metric) {
			if (metric.view == searchView)
				metrics.pushObject(App.Metric.create({id: metric.id},{view: metric.view}, {calculation: metric.calculation}, {format: metric.format}, {width: metric.width}));
		});
		this._metrics = metrics;
		return metrics;
	}
});






/*
App.Metric = Ember.Object.extend({
	key : "",
	view : "",
	values: [],
	calculation: "",
	format: "",
	graph_name: "",
	graph_id: "",
	width: ""
});





App.Metric.FIXTURES = [
	{ 
	"key" : "dau", 
	"view" : "Dashboard", 
	"values" : [{"date":"2013-07-11", "value":"100"}, {"date":"2013-07-12", "value":"120"}, {"date":"2013-07-13", "value":"170"}],  
	"calculation" : "sum", 
	"format" : "bar", 
	"graph_name" : "dau", 
	"graph_id" : "dau", 
	"width" : "48%" 
	}
];


App.Filter.FIXTURES = [
	{
	id : 1,
	title: "Dates",
	values : [1,3,7,14,30,60,90,180,360],
	selected : [7]
	},

	{  
	id : 2,
	title : "Devices",
	values : ["iPad 2", "iPad 3", "iPad 4"],
	selected : ["iPad 2", "iPad 3", "iPad 4"]
	},

	{  
	id : 3,
	title : "Publishers",
	values : ["1", "2", "3"],
	selected : ["1"]
	}

];
*/