//Models

var defaultFilters = ['dates', 'devices', 'publisher'];


//set Filter class. The Filter object will be multiplied for each filter.
App.Filter = Ember.Object.extend({
	//capitalize first letter to get title
	filterTitle: function() {
		return this.get('id').charAt(0).toUpperCase() + this.get('id').slice(1);
	}.property('id'),

	//set attribute to see if filter is loaded
	loadedFilter: false,

	//create method to load filter values from server
	loadValues: function() {
		var filter = this;
		return Ember.Deferred.promise(function (p) {  
			if (filter.get('loadedFilter')) { 
				p.resolve(filter.get('values'));

			} else {
				p.resolve($.getJSON("http://127.0.0.1:13373/" + filter.get('id') +".json").then(function(response) {
				var values = Ember.A();
				response['values'].forEach(function(value) {
					values.push(value);
				});
				filter.setProperties({values: values, loadFilter: true});
				return values;
				}))
			}})}
	}  
);

//reopen class to create "all" method which returns all instances of Filter class
App.Filter.reopenClass({
	all: function() {
		if (this._all) {return this._all; }
		var all = Ember.A();
		defaultFilters.forEach(function(id) {
			all.pushObject(App.Filter.create({id: id}));
		});
		this._all = all;
		return all;
	}
});

//reopen Filter to set an observer that notifies when filter is changed
App.Filter.reopen({
	filterChanged: Ember.observer(function() {
	console.log("filter changed");
}, 'this.values.@each.selected')
});



/*
App.Metric = Ember.Object.extend({
	key : "",
	view : "",
	values: [],
	calculation: "",
	format: "",
	graph_name: "",
	graph_id: "",
	width: ""
});





App.Metric.FIXTURES = [
	{ 
	"key" : "dau", 
	"view" : "Dashboard", 
	"values" : [{"date":"2013-07-11", "value":"100"}, {"date":"2013-07-12", "value":"120"}, {"date":"2013-07-13", "value":"170"}],  
	"calculation" : "sum", 
	"format" : "bar", 
	"graph_name" : "dau", 
	"graph_id" : "dau", 
	"width" : "48%" 
	}
];


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
*/