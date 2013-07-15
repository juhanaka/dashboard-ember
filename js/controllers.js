App.ApplicationController = Ember.ArrayController.extend({
	//ApplicationController controls all the filters. Let's create a controller to handle each instance of a filter
	itemController: 'filter'
});

App.FilterController = Ember.ObjectController.extend({
	//this sets the titleId property that is used only for binding html attributes in template. Stupid way to do this.
	titleId: function() {
		return "#" + this.get('filterTitle');}.property('filterTitle')
});