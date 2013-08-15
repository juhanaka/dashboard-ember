//Routers

//map each resource
App.Router.map(function() {
	this.resource('dashboard', {path: "/"});
	this.resource('economy');
	this.resource('gameplay');
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
		return App.Chart.findByView('Dashboard');
	}
});

App.EconomyRoute = Ember.Route.extend({
	model: function() {
		return App.Chart.findByView('Economy');
	}
});

App.GameplayRoute = Ember.Route.extend({
	model: function() {
		return App.Chart.findByView('Gameplay');
	}
});

