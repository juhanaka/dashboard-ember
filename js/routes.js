//Routers

//map each resource
App.Router.map(function() {
	this.resource('dashboard', {path: "/"});
	this.resource('economy');
});



App.ApplicationRoute = Ember.Route.extend({
	//set application routes model to all filters
	model: function() {
		return App.Filters;
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
	}

});

App.DashboardRoute = Ember.Route.extend({
	model: function() {
		return App.Metric.findByView('Dashboard');
	},

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


});

App.EconomyRoute = Ember.Route.extend({
	model: function() {
		return App.Metric.findByView('Economy');
	},
	
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
	}

});

