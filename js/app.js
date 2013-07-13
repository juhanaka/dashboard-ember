App = Ember.Application.create({
	LOG_TRANSITIONS: true,
});

App.FixtureStore = DS.Store.extend({
  adapter: 'DS.FixtureAdapter'
});

Ember.LOG_BINDINGS = true;

//Routers
App.Router.map(function() {
	this.resource('application');
	this.route('filters');
});


App.FiltersRoute = Ember.Route.extend({		
	setupController: function(controller, filter) {
		controller.set('model', App.Filter.all());
	}
});

App.FiltersController = Ember.ArrayController.extend({
	}
);





//Models



App.Filter = DS.Model.extend({
	title: DS.attr('string'),
	values: DS.attr('array'),
	selected: DS.attr('array')
});

/*
App.Filters = Ember.Object.extend({

})

App.Filter = Ember.Object.extend({
	title: "",
	values: [],
	selected: []
});

App.Dates = Filter.create();
App.
*/


App.Filter.FIXTURES = [
	{
	id : 1,
	title: "Dates",
	values : [1,3,7,14,30,60,90,180,360],
	selected : [7]
	}

/*	{  
	id : 2,
	title : "Devices",
	values : ["iPad 2", "iPad 3", "iPad 4"],
	selected : ["iPad 2", "iPad 3", "iPad 4"]
	}
*/

];

console.log(App.Filter.find());

//Views



//Controllers

