App = Ember.Application.create({
	LOG_TRANSITIONS: true,
});

App.Store = DS.Store.extend({
  adapter: 'DS.FixtureAdapter'
});


//Routers
App.Router.map(function() {
	this.resource('dashboard', {path: "/"});
});



App.ApplicationRoute = Ember.Route.extend({
	model: function() {
		return App.Filter.find();
	},
	setupController: function(controller, filter) {
		controller.set('model', filter);
	},

});



//Models



App.Filter = DS.Model.extend({
	title: DS.attr('string'),
	values: DS.attr('array'),
	selected: DS.attr('array')
});



App.Filter.FIXTURES = [
	{
	id : 1,
	title: "Dates",
	values : [1,3,7,14,30,60,90,180,360],
	selected : [7]
	},

	{  
	id : 2,
	title : "Devices",
	values : ["iPad 2", "iPad 3", "iPad 4"],
	selected : ["iPad 2", "iPad 3", "iPad 4"]
	},

	{  
	id : 3,
	title : "Publishers",
	values : ["1", "2", "3"],
	selected : ["1"]
	}

];


//Views



//Controllers

App.ApplicationController = Ember.ArrayController.extend({
	itemController: 'filter'
});

App.FilterController = Ember.ObjectController.extend({
	titleId: function() {
		return "#" + this.get('title');}.property('title')
	}
);


