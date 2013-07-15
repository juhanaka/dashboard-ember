//Routers

//map each resource
App.Router.map(function() {
	this.resource('dashboard', {path: "/"});
	this.resource('economy');
});



App.ApplicationRoute = Ember.Route.extend({
	//set application routes model to all filters
	model: function() {
		return App.Filter.all();
	},

	//after filter has loaded, let's load its values
	afterModel: function(model) {
		return model.forEach(function(item) {
			item.loadValues();
		});
	},

	//create a controller called ApplicationController and pass the filter as its model
	setupController: function(controller, filter) {
		controller.set('model', filter);
	},

});