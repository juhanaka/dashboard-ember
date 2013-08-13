App.ApplicationController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'filter'
});

App.FilterController = Ember.ObjectController.extend({
	//this sets the titleId property that is used only for binding html attributes in template. Stupid way to do this.
	titleId: function() {
		return "#" + this.get('filterTitle');}.property('filterTitle')
});

App.MetricController = Ember.ObjectController.extend({
	reduceField: function() {
		var fields = this.get('groupFields');
		var field = "";
		fields.forEach(function(element) {
			if (element.isActive) 
				field = element.name})
		console.log(field);
		return field;
	}.property('groupFields'),

	select: function(name) {
		console.log(this.get('groupFields')[0].isActive);
		this.set('reduceField', name);
	},

	calculatedData: function() {
		return reduceByField(this.get('values'), this.get('reduceField'), this.get('calculation'), this.get('id'))
	}.property('values', 'reduceField', 'calculation', 'id')
});








App.DashboardController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'metric',
	updateCharts: function(model) {
		model.forEach(function(metric) {
			metric.set('loadedMetric', false);;
			metric.loadValues()});
	},



});

App.EconomyController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'metric',
	updateCharts: function(model) {
	model.forEach(function(metric) {
		metric.set('loadedMetric', false);;
		metric.loadValues()});
},

	

});

