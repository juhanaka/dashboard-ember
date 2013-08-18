var defaultFilters = [{'id':'dates', 'range':true}, {'id':'devices', 'range':false}];

var defaultMetricsSettings = [
{"id":"dau"}, 
{"id":"dnu"}, 
{"id":"revenue"}
];

var chartSettings = [
{"id": "Dnu", "view" : "Dashboard", "metricIds" : ["dnu", "dau"], "normalize": true, "display": "percentage", "normalizeWith": {"dnu":"dau"}, "format" :"bar", "width": "48%", "groupFields": [{"name":"date", "isActive":true}, {"name":"device", "isActive":false}]},
{"id": "Dau & Dnu", "view" : "Dashboard", "metricIds" : ["dau","dnu"], "normalize": false, "format" :"bar", "width": "48%", "groupFields": [{"name":"date", "isActive":true}, {"name":"device", "isActive":false}]},
{"id": "Just Dau", "view" : "Economy", "metricIds" : ["dau"], "normalize": false, "format" :"bar", "width": "48%", "groupFields": [{"name":"date", "isActive":true}, {"name":"device", "isActive":false}]},
];



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
				console.log('got response for filters');
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
		var promise;
		defaultFilters.forEach(function(defaultFilter) {
			var filter = App.Filter.create({id: defaultFilter.id, range: defaultFilter.range});
			all.pushObject(filter);
		});
		this._all = all;

		var promise;
		all.forEach(function(item) {
			if(promise) {
				promise = promise.then(function() {
					item.loadValues();
				});
			} else {
				promise = item.loadValues();
			}
		 });

		all.loadedFilters = promise;
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
	var loadedFilters = filters.get('loadedFilters');
	  
		return Ember.Deferred.promise(function (p) {
			loadedFilters.then(function() {   
				if (metric.get('loadedMetric')) { 
					p.resolve(metric.get('values'));

				} else {
					p.resolve(
					console.log('sending request for metrics'),
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
			} }) })}
});


App.Metric.reopenClass({
	all: function() {
		if (this._all) {return this._all; }
		var all = Ember.A();
		defaultMetricsSettings.forEach(function(metric) {
			var metric = App.Metric.create({id: metric.id});
			all.pushObject(metric);
		});
		this._all = all;

		var promise;
		all.forEach(function(item) {
			if (promise) {
				promise = promise.then(function() {
					item.loadValues();
				});
			} else {
				promise = item.loadValues();
			}
		 });

		all.loadedMetrics = promise;
		return all;}
});

App.Metrics = App.Metric.all();


App.Chart = Ember.Object.extend({
	metricsBinding: 'App.Metrics',

	chartMetrics: function() {
		var chart = this;
		var metrics = chart.get('metrics');
		var loadedMetrics = metrics.get('loadedMetrics');
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
				charts.pushObject(App.Chart.create({id: chart.id}, {format: chart.format}, {display: chart.display}, {width: chart.width}, {view: chart.view}, {metricIds: chart.metricIds}, {normalize: chart.normalize}, {normalizeWith: chart.normalizeWith}, {groupFields: chart.groupFields}));
		});
		return charts;
	}
})

