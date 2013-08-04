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
	reduceField: 'date',
	calculatedData: function() {
		return reduceByField(this.get('values'), this.get('reduceField'), this.get('calculation'), this.get('id'))
	}.property('values', 'reduceField', 'calculation', 'id')
});








App.DashboardController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'metric'
});

App.EconomyController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'metric'
});

