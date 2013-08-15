var defaultMetricsSettings = [
{"id":"dau"}, 
{"id":"dnu"}, 
{"id":"revenue"}
];

var chartSettings = [
{"id": "dnu", "view" : "Gameplay", "metricIds" : ["dnu", "dau"], "normalize": true, "normalizeWith": "dau", "format" :"bar", "width": "48%", "groupFields": [{"name":"date", "isActive":true}, {"name":"device", "isActive":false}]}
];

var defaultFilters = ['dates'];


//Models

//FILTER MODELS




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

//reopen Filter to set an observer that notifies when filter is changed. Note: this is now not in use
App.Filter.reopen({
	filterChanged: Ember.observer(function() {
	console.log("filter changed");
}, 'this.values.@each.selected')
});

App.Filters = App.Filter.all();


//METRICS MODELS

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
				});
				metric.setProperties({"values": values, "loadedMetric": true});
				return values;
				}))
			}})}
});


App.Metric.reopenClass({
	all: function() {
		if (this._all) {return this._all; }
		var all = Ember.A();
		defaultMetricsSettings.forEach(function(metric) {
			var metric = App.Metric.create({id: metric.id});
			metric.loadValues();
			all.pushObject(metric);
		});
		this._all = all;
		return all;}
});

App.Metrics = App.Metric.all();

App.Chart = Ember.Object.extend({
	metricsBinding: 'App.Metrics',

	chartMetrics: function() {
		var chart = this;
		var metrics = chart.get('metrics');
		var chartMetrics = Ember.A();
		chart.get('metricIds').forEach(function(metricId) {
			metrics.filter(function(metric) {
			if (metric.id == metricId)
				chartMetrics.pushObject(metric);
		})})
		return chartMetrics;
	}.property('metrics', 'metricIds')	
});

App.Chart.reopenClass({
	findByView: function(searchView) {
		if (this._findByView) {return this._findByView; }
		var charts = Ember.A();
		chartSettings.forEach(function(chart) {
			if (chart.view == searchView)
				charts.pushObject(App.Chart.create({id: chart.id}, {format: chart.format}, {width: chart.width}, {view: chart.view}, {metricIds: chart.metricIds}, {normalize: chart.normalize}, {normalizeWith: chart.normalizeWith}, {groupFields: chart.groupFields}));
		});
		return charts;
	}
})

