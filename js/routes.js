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
		var promise;
		model.forEach(function(item) {
			if (promise) {
				promise = promise.then(function() {
					item.loadValues();
				});
			} else {
				promise = item.loadValues();
			}
		});

		return promise
	},

	//create a controller called ApplicationController and pass the filter as its model
	setupController: function(controller, filter) {
		controller.set('model', filter);
	}

});

App.DashboardRoute = Ember.Route.extend({
	model: function() {
		return App.Metric.findByView('Dashboard');
	},

	afterModel: function(model) {
		return model.forEach(function(item) {
			item.loadValues();
		});
	},

	setupController: function(controller, model) {
		controller.set('model', model);
	}
});