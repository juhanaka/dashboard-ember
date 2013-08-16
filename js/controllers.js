App.ApplicationController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'filter'
});

App.FilterController = Ember.ObjectController.extend({
	//this sets the titleId property that is used only for binding html attributes in template. Stupid way to do this.
	titleId: function() {
		return "#" + this.get('filterTitle');}.property('filterTitle')
});


App.ChartController = Ember.ObjectController.extend({
	reduceField: function() {
		var fields = this.get('groupFields');
		var field = "";
		fields.forEach(function(element) {
			if (element.isActive) 
				field = element.name})
		return field;
	}.property('groupFields'),

	select: function(name) {
	console.log(this.get('groupFields')[0].isActive);
	this.set('reduceField', name);
	},

	calculatedData: function() {
		console.log(this.get('loadedMetrics'));
		var calculatedData = Ember.A();
		var chart = this;
		var metrics = chart.get('chartMetrics');
		metrics.forEach( function(metric) {
			console.log(metric);
			console.log(metric.get('values'));
			calculatedData.pushObject(reduceByField(metric.values, chart.get('reduceField'), metric.id))
		});
		console.log(calculatedData)

		if (this.get('normalize')) {calculatedData = divide(calculatedData, this.get('normalizeWith'))}
		return calculatedData
	}.property('reduceField', 'calculation', 'metrics.@each.values', 'normalize', 'normalizeWith')

})







App.DashboardController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'chart',
	updateCharts: function(model) {
	console.log(model[0]);
	var metrics = model[0].get('metrics');
	console.log(metrics);
	metrics.forEach(function(metric) {
		metric.set('loadedMetric', false);
		metric.loadValues()});

	}



});

App.EconomyController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'chart',
	updateCharts: function(model) {
	console.log(model[0]);
	var metrics = model[0].get('metrics');
	console.log(metrics);
	metrics.forEach(function(metric) {
		metric.set('loadedMetric', false);
		metric.loadValues()});

	}

	

});

App.GameplayController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'chart',
	updateCharts: function(model) {
	console.log(model[0]);
	var metrics = model[0].get('metrics');
	console.log(metrics);
	metrics.forEach(function(metric) {
		metric.set('loadedMetric', false);
		metric.loadValues()});

	}
});

